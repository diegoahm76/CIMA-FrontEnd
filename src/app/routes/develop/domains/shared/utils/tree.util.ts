import {HttpParams} from '@angular/common/http';
import {BehaviorSubject, concat, forkJoin, Observable, of, timer} from 'rxjs';
import {catchError, map, mergeMap, shareReplay} from 'rxjs/operators';

import {NGXLogger} from 'ngx-logger';

import {environment} from '@environments/environment';
import {ApiService, Store} from '@shared/services';
import {ApplicationError} from '@shared/utils';
import {Paginator} from '@shared/interfaces';
import {StoreStatus} from '@shared/enums';
import {DevelopDomainModel} from '@app/routes/shared/models';

interface StreamInput {
  status?: StoreStatus;
  urlParams?: HttpParams;
  parentModel?: any;
  level?: number;
}

export interface TreeState {
  status: StoreStatus;
  error?: ApplicationError | any;
  parentModel?: any;
  level?: number;
  list?: DevelopDomainModel[];
}

export class TreeUtil extends Store<StreamInput, TreeState> {
  private readonly apiService: ApiService;
  private readonly logger: NGXLogger;

  constructor(dependencies: {apiService: ApiService; logger: NGXLogger}) {
    super();

    this.apiService = dependencies.apiService;
    this.logger = dependencies.logger;

    // @TODO: deprecated
    // this.subject = new ReplaySubject<StreamInput>(1);
    this.subject = new BehaviorSubject<StreamInput>({
      status: StoreStatus.INITIATED,
    });

    this.initState();
  }

  protected initState() {
    this.state$ = this.subject.pipe(
      mergeMap(({status, urlParams, parentModel, level}: StreamInput) => {
        if (status === StoreStatus.INITIATED) {
          return of({status});
        }

        return concat(
          of({status: StoreStatus.LOADING} as TreeState),
          forkJoin([
            this.doQuery(urlParams, parentModel, level),
            timer(environment.minDelay),
          ]).pipe(
            // map(([{state, _currentNode}, _]: [{state: TreeState, _currentNode?: Node}, any]) => {
            //   return {state, currentNode: _currentNode};
            // }),
            // map(({state, _currentNode}: {state: TreeState, _currentNode?: Node}) => {
            //   // @TODO: hace lo que tiene que hacer
            //   return state;
            // })
            map(([state, dummy]: [TreeState, any]) => state)
          )
        );
      }),
      shareReplay(1)
    );
  }

  private doQuery(
    urlParams: HttpParams,
    parentModel: any,
    level: number
  ): Observable<any> {
    return DevelopDomainModel.search(this.apiService, urlParams).pipe(
      map(
        ({
          list,
          paginator,
        }: {
          list: DevelopDomainModel[];
          paginator: Paginator;
        }) => {
          return {
            status: StoreStatus.OK,
            parentModel,
            level,
            list,
          } as TreeState;
        }
      ),
      catchError((error: ApplicationError | any) => {
        return of({status: StoreStatus.ERROR, error} as TreeState);
      })
    );
  }

  next(value?: StreamInput) {
    this.setState(value);
  }
}
