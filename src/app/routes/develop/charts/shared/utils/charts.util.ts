import {BehaviorSubject, concat, forkJoin, Observable, of, timer} from 'rxjs';
import {map, shareReplay, switchMap} from 'rxjs/operators';

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

interface StreamInput {
  status?: StoreStatus;
}

export interface ChartsState {
  status: StoreStatus;
  error?: ApplicationError | any;
  categories?: string[];
  series?: number[][];
}

export class ChartsUtil extends Store<StreamInput, ChartsState> {
  private appService: AppService;
  private readonly permissionsService: PermissionsService;
  private apiService: ApiService;
  private logger: NGXLogger;

  constructor(dependencies: {
    appService: AppService;
    permissionsService: PermissionsService;
    apiService: ApiService;
    logger: NGXLogger;
  }) {
    super();

    this.appService = dependencies.appService;
    this.permissionsService = dependencies.permissionsService;
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
      switchMap(({status}: StreamInput) => {
        if (status === StoreStatus.INITIATED) {
          return of({status});
        }

        return concat(
          of({status: StoreStatus.LOADING}),
          forkJoin([this.doQuery(), timer(environment.minDelay)]).pipe(
            map(([state, _]: [ChartsState, any]) => state)
          )
        );
      }),
      shareReplay(1)
    );
  }

  private doQuery(): Observable<ChartsState> {
    const categories: string[] = [
      'Apples',
      'Oranges',
      'Pears',
      'Grapes',
      'Bananas',
    ];
    const series: number[][] = [[5, 3, 4, 7, 2]];
    return of({status: StoreStatus.OK, categories, series} as ChartsState);
  }

  next(value: StreamInput) {
    this.setState(value);
  }
}
