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
import {DevelopUserModel} from '@app/routes/shared/models';

interface StreamInput {
  status?: StoreStatus;
  data?: Params;
  oldModel?: DevelopUserModel;
}

export interface SubmitUserState {
  status: StoreStatus;
  error?: ApplicationError | any;
  model?: DevelopUserModel;
  oldModel?: DevelopUserModel;
}

@Injectable()
export class SubmitUserService extends Store<StreamInput, SubmitUserState> {
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
            map(([state, dummy]: [SubmitUserState, any]) => {
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

  private doQuery(data: Params): Observable<SubmitUserState> {
    return this.apiService.save('users', data).pipe(
      map((resData: Params) => {
        return DevelopUserModel.getInstance(resData);
      }),
      // @TODO
      // tap((model: User) => {
      //   // ACL
      //   this.setAcl(model);
      //
      //   this.loadDependencies(model);
      // }),
      map((model: DevelopUserModel) => {
        return {status: StoreStatus.OK, model} as SubmitUserState;
      }),
      catchError((error: ApplicationError | any) => {
        return of({status: StoreStatus.ERROR, error} as SubmitUserState);
      })
    );
  }

  next(value: StreamInput) {
    this.setState(value);
  }
}
