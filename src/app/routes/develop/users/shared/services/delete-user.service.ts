import {Injectable} from '@angular/core';
import {BehaviorSubject, concat, forkJoin, Observable, of, timer} from 'rxjs';
import {catchError, map, shareReplay, switchMap} from 'rxjs/operators';

import {NGXLogger} from 'ngx-logger';

import {environment} from '@environments/environment';
import {ApiService, Store} from '@shared/services';
import {ApplicationError} from '@shared/utils';
import {StoreStatus} from '@shared/enums';
import {DevelopUserModel} from '@app/routes/shared/models';

interface StreamInput {
  status?: StoreStatus;
  model?: DevelopUserModel;
}

export interface DeleteUserState {
  status: StoreStatus;
  error?: ApplicationError | any;
}

@Injectable()
export class DeleteUserService extends Store<StreamInput, DeleteUserState> {
  constructor(private apiService: ApiService, private logger: NGXLogger) {
    super();

    this.subject = new BehaviorSubject<StreamInput>({
      status: StoreStatus.INITIATED,
    });

    this.initState();
  }

  protected initState() {
    this.state$ = this.subject.pipe(
      switchMap(({status, model}: StreamInput) => {
        if (status === StoreStatus.INITIATED) {
          return of({status});
        }

        return concat(
          of({status: StoreStatus.LOADING}),
          forkJoin([this.doQuery(model), timer(environment.minDelay)]).pipe(
            map(([state, dummy]: [DeleteUserState, any]) => state)
          )
        );
      }),
      shareReplay(1)
    );
  }

  private doQuery(model: DevelopUserModel): Observable<DeleteUserState> {
    return this.apiService.delete(`users/${model.strId}`).pipe(
      map(() => {
        return {status: StoreStatus.OK} as DeleteUserState;
      }),
      catchError((error: ApplicationError | any) => {
        return of({status: StoreStatus.ERROR, error} as DeleteUserState);
      })
    );
  }

  next(value: StreamInput) {
    this.setState(value);
  }
}
