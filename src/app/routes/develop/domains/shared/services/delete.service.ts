import {Injectable} from '@angular/core';
import {BehaviorSubject, concat, forkJoin, Observable, of, timer} from 'rxjs';
import {catchError, map, shareReplay, switchMap} from 'rxjs/operators';

import {NGXLogger} from 'ngx-logger';

import {environment} from '@environments/environment';
import {ApiService, Store} from '@shared/services';
import {ApplicationError} from '@shared/utils';
import {StoreStatus} from '@shared/enums';
import {DevelopDomainModel} from '@app/routes/shared/models';

interface StreamInput {
  status?: StoreStatus;
  model?: DevelopDomainModel;
}

export interface DeleteState {
  status: StoreStatus;
  error?: ApplicationError | any;
}

@Injectable()
export class DeleteService extends Store<StreamInput, DeleteState> {
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
            map(([state, dummy]: [DeleteState, any]) => state)
          )
        );
      }),
      shareReplay(1)
    );
  }

  private doQuery(model: DevelopDomainModel): Observable<any> {
    return this.apiService.delete(`domains/${model.strId}`).pipe(
      map(() => {
        return {status: StoreStatus.OK} as DeleteState;
      }),
      catchError((error: ApplicationError | any) => {
        return of({status: StoreStatus.ERROR, error} as DeleteState);
      })
    );
  }

  next(value: StreamInput) {
    this.setState(value);
  }
}
