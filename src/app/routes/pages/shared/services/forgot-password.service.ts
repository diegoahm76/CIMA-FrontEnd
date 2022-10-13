import {Injectable} from '@angular/core';
import {Params} from '@angular/router';
import {BehaviorSubject, concat, forkJoin, of, timer} from 'rxjs';
import {catchError, map, shareReplay, switchMap} from 'rxjs/operators';

import {NGXLogger} from 'ngx-logger';

import {environment} from '@environments/environment';
import {ApiService, PermissionsService, Store} from '@shared/services';
import {ApplicationError} from '@shared/utils';
import {StoreStatus} from '@shared/enums';

interface StreamInput {
  status?: StoreStatus;
  data?: Params;
}

export interface ForgotPasswordState {
  status: StoreStatus;
  error?: ApplicationError | any;
}

@Injectable()
export class ForgotPasswordService extends Store<
  StreamInput,
  ForgotPasswordState
> {
  constructor(
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
      switchMap(({status, data}: StreamInput) => {
        if (status === StoreStatus.INITIATED) {
          return of({status});
        }

        return concat(
          of({status: StoreStatus.LOADING}),
          forkJoin([this.doQuery(data), timer(environment.minDelay)]).pipe(
            map(([state, _]: [ForgotPasswordState, any]) => state)
          )
        );
      }),
      shareReplay(1)
    );
  }

  private doQuery(data: Params) {
    return this.apiService.save('auth/forgot-password', data).pipe(
      map(() => {
        return {status: StoreStatus.OK} as ForgotPasswordState;
      }),
      catchError((error: ApplicationError | any) => {
        return of({status: StoreStatus.ERROR, error} as ForgotPasswordState);
      })
    );
  }

  next(value: StreamInput) {
    this.setState(value);
  }
}
