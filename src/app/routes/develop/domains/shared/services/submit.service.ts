import {Injectable} from '@angular/core';
import {Params} from '@angular/router';
import {BehaviorSubject, concat, forkJoin, Observable, of, timer} from 'rxjs';
import {catchError, map, shareReplay, switchMap} from 'rxjs/operators';

import {NGXLogger} from 'ngx-logger';

import {environment} from '@environments/environment';
import {
  ApiService,
  AppService,
  PermissionsService,
  Store,
} from '@shared/services';
import {ApplicationError} from '@shared/utils';
import {StoreStatus} from '@shared/enums';
import {DevelopDomainModel} from '@app/routes/shared/models';

interface StreamInput {
  status?: StoreStatus;
  data?: Params;
  oldModel?: DevelopDomainModel;
}

export interface SubmitState {
  status: StoreStatus;
  error?: ApplicationError | any;
  model?: DevelopDomainModel;
  oldModel?: DevelopDomainModel;
}

@Injectable()
export class SubmitService extends Store<StreamInput, SubmitState> {
  constructor(
    private appService: AppService,
    private permissionsService: PermissionsService,
    private apiService: ApiService,
    private logger: NGXLogger
  ) {
    super();

    this.subject = new BehaviorSubject<StreamInput>({
      status: StoreStatus.INITIATED,
    });

    this.initState();
  }

  protected initState() {
    this.state$ = this.subject.pipe(
      switchMap(({status, data, oldModel}: StreamInput) => {
        if (status === StoreStatus.INITIATED) {
          return of({status});
        }

        return concat(
          of({status: StoreStatus.LOADING}),
          forkJoin([this.doQuery(data), timer(environment.minDelay)]).pipe(
            map(([state, dummy]: [SubmitState, any]) => {
              if (state.status === StoreStatus.OK) {
                state.oldModel = oldModel;
              }
              return state;
            })
          )
        );
      }),
      shareReplay(1)
    );
  }

  private doQuery(data: Params): Observable<any> {
    return this.apiService.save('domains', data, ['value']).pipe(
      map((resData: Params) => {
        return DevelopDomainModel.getInstance(resData);
      }),
      // @TODO
      // tap((model: User) => {
      //   // ACL
      //   this.setAcl(model);
      //
      //   this.loadDependencies(model);
      // }),
      map((model: DevelopDomainModel) => {
        return {status: StoreStatus.OK, model} as SubmitState;
      }),
      catchError((error: ApplicationError | any) => {
        return of({status: StoreStatus.ERROR, error} as SubmitState);
      })
    );
  }

  next(value: StreamInput) {
    this.setState(value);
  }
}
