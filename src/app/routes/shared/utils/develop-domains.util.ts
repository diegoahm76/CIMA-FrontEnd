import {HttpParams} from '@angular/common/http';
import {
  BehaviorSubject,
  concat,
  forkJoin,
  Observable,
  of,
  Subject,
  timer,
} from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators';

import * as _ from 'lodash';
import {multiScan} from 'rxjs-multi-scan';
import {NGXLogger} from 'ngx-logger';

import {environment} from '@environments/environment';
import {
  ApiService,
  AppService,
  PermissionsService,
  Store,
} from '@shared/services';
import {ApplicationError, PermissionsUtil} from '@shared/utils';
import {Paginator} from '@shared/interfaces';
import {StoreStatus} from '@shared/enums';
import {DevelopDomainModel} from '@app/routes/shared/models';

interface StreamInput {
  status?: StoreStatus;
  urlParams?: HttpParams;
}

export interface DevelopDomainsState {
  status: StoreStatus;
  error?: ApplicationError | any;
  list?: DevelopDomainModel[];
  paginator?: Paginator;
}

export class DevelopDomainsUtil extends Store<
  StreamInput,
  DevelopDomainsState
> {
  private appService: AppService;
  private readonly permissionsService: PermissionsService;
  private apiService: ApiService;
  private logger: NGXLogger;

  add: Subject<DevelopDomainModel>;
  update: Subject<{model: DevelopDomainModel; oldModel: DevelopDomainModel}>;
  remove: Subject<DevelopDomainModel>;

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

    this.add = new Subject<DevelopDomainModel>();
    this.update = new Subject<{
      model: DevelopDomainModel;
      oldModel: DevelopDomainModel;
    }>();
    this.remove = new Subject();

    this.initState();
  }

  protected initState() {
    this.state$ = multiScan(
      this.subject.pipe(
        distinctUntilChanged((prev: StreamInput, curr: StreamInput) => {
          return _.isEqual(prev, curr);
        }),
        switchMap(({status, urlParams}: StreamInput) => {
          if (status === StoreStatus.INITIATED) {
            return of({status});
          }

          return concat(
            of({status: StoreStatus.LOADING}),
            forkJoin([
              this.doQuery(urlParams),
              timer(environment.minDelay),
            ]).pipe(map(([state, dummy]: [DevelopDomainsState, any]) => state))
          );
        })
      ),
      (previousState: DevelopDomainsState, newState: DevelopDomainsState) => {
        this.logger.info('query reducer', previousState, newState);
        // if (usersState.status === StoreStatus.OK) {
        //   // usersState.list = [...heroes, ...usersState.list];
        //   return usersState;
        // }
        return newState;
      },
      this.add,
      (state: DevelopDomainsState, newModel?: DevelopDomainModel) => {
        this.logger.info('add reducer', state, newModel);
        state.list = [...[newModel], ...state.list];
        return state;
      },
      this.update,
      (
        state: DevelopDomainsState,
        {
          model,
          oldModel,
        }: {model: DevelopDomainModel; oldModel: DevelopDomainModel}
      ) => {
        this.logger.info('update reducer', state, model, oldModel);
        const pos = state.list.findIndex((m: DevelopDomainModel) => {
          return m.id === oldModel.id;
        });
        if (pos !== -1) {
          state.list[pos] = model;
        }
        return state;
      },
      this.remove,
      (state: DevelopDomainsState, model?: DevelopDomainModel) => {
        this.logger.info('remove reducer', state, model);
        const pos = state.list.findIndex((m: DevelopDomainModel) => {
          return m.id === model.id;
        });
        if (pos !== -1) {
          state.list.splice(pos, 1);
        }
        return state;
      },
      {status: StoreStatus.INITIATED}
    ).pipe(shareReplay(1));
  }

  private doQuery(urlParams?: HttpParams): Observable<any> {
    return DevelopDomainModel.search(this.apiService, urlParams).pipe(
      tap(
        ({
          list,
          paginator,
        }: {
          list: DevelopDomainModel[];
          paginator: Paginator;
        }) => {
          // ACL
          list.forEach((model: DevelopDomainModel) => this.setAcl(model));

          this.loadDependencies(list);
        }
      ),
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
            list,
            paginator,
          } as DevelopDomainsState;
        }
      ),
      catchError((error: ApplicationError | any) => {
        return of({status: StoreStatus.ERROR, error} as DevelopDomainsState);
      })
    );
  }

  next(value: StreamInput) {
    this.setState(value);
  }

  setAcl(model: DevelopDomainModel) {
    // @TODO
    // const modelOptions: {[tempProp: string]: any} = {
    //   status: model.status
    // };
    // model._permissions = new PermissionsUtil(
    //   this.permissionsService,
    //   modelOptions,
    //   this.appService.currentUser._role
    // );
  }

  private loadDependencies(list: DevelopDomainModel | DevelopDomainModel[]) {
    this.logger.info('domainsService: loadDependencies', list);

    if (!Array.isArray(list)) {
      list = [list];
    }

    if (!list.length) {
      return;
    }

    // let stateIds = [];
    // let cityIds = [];
    // for (const user of list) {
    //   if (user.stateId) {
    //     stateIds.push(user.stateId);
    //   }
    //   if (user.cityId) {
    //     cityIds.push(user.cityId);
    //   }
    // }
    // stateIds = Array.from(new Set(stateIds));
    // cityIds = Array.from(new Set(cityIds));
    // if (stateIds.length) {
    //   this.logger.info('stateIds', stateIds);
    //   this.statesUtil.next({
    //     urlParams: new HttpParams({
    //       fromObject: {
    //         ids: stateIds.join(',')
    //       }
    //     }),
    //     users: list
    //   });
    // }
    // if (cityIds.length) {
    //   this.logger.info('cityIds', cityIds);
    //   this.citiesUtil.next({
    //     urlParams: new HttpParams({
    //       fromObject: {
    //         ids: cityIds.join(',')
    //       }
    //     }),
    //     users: list
    //   });
    // }
  }

  unshiftModel(model: DevelopDomainModel) {
    // ACL
    // this.setAcl(model);
    //
    // // this.updateDependenciesCaches(model);
    //
    // // Agrega el nuevo modelo al comienzo de la lista
    // list.unshift(model);
    //
    // this.loadDependencies(model);

    this.add.next(model);
  }

  updateModel(model: DevelopDomainModel, oldModel: DevelopDomainModel) {
    // Busca el modelo y reemplaza la referencia
    // const pos = list.findIndex(
    //   (m: Domain) => m.id === model.id
    // );
    // if (pos !== -1) {
    //   // ACL
    //   this.setAcl(model);
    //
    //   // this.updateDependenciesCaches(model);
    //
    //   // Actualiza el modelo editado
    //   list[pos] = model;
    //
    //   // this.loadDependencies(model);
    // } else {
    //   console.warn(
    //     `No se encontro el usuario "${model.id}" que se desea actualizar en la lista`
    //   );
    // }

    this.update.next({model, oldModel});
  }

  removeModel(model: DevelopDomainModel) {
    this.remove.next(model);
  }
}
