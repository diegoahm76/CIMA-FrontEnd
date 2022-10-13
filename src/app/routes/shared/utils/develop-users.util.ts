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
import {catchError, map, shareReplay, switchMap, tap} from 'rxjs/operators';

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
import {DevelopUserModel} from '@app/routes/shared/models';

interface StreamInput {
  status?: StoreStatus;
  urlParams?: HttpParams;
}

export interface DevelopUsersState {
  status: StoreStatus;
  error?: ApplicationError | any;
  list?: DevelopUserModel[];
  paginator?: Paginator;
}

export class DevelopUsersUtil extends Store<StreamInput, DevelopUsersState> {
  private appService: AppService;
  private readonly permissionsService: PermissionsService;
  private apiService: ApiService;
  private logger: NGXLogger;

  add: Subject<DevelopUserModel>;
  update: Subject<{model: DevelopUserModel; oldModel: DevelopUserModel}>;
  remove: Subject<DevelopUserModel>;

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

    this.add = new Subject<DevelopUserModel>();
    this.update = new Subject<{
      model: DevelopUserModel;
      oldModel: DevelopUserModel;
    }>();
    this.remove = new Subject();

    this.initState();
  }

  protected initState() {
    this.state$ = multiScan(
      this.subject.pipe(
        switchMap(({status, urlParams}: StreamInput) => {
          if (status === StoreStatus.INITIATED) {
            return of({status});
          }

          return concat(
            of({status: StoreStatus.LOADING}),
            forkJoin([
              this.doQuery(urlParams),
              timer(environment.minDelay),
            ]).pipe(map(([state, dummy]: [DevelopUsersState, any]) => state))
          );
        })
      ),
      (previousState: DevelopUsersState, newState: DevelopUsersState) => {
        this.logger.info('query reducer', previousState, newState);
        // if (usersState.status === StoreStatus.OK) {
        //   // usersState.list = [...heroes, ...usersState.list];
        //   return usersState;
        // }
        return newState;
      },
      this.add,
      (state: DevelopUsersState, newModel?: DevelopUserModel) => {
        this.logger.info('add reducer', state, newModel);
        state.list = [...[newModel], ...state.list];
        return state;
      },
      this.update,
      (
        state: DevelopUsersState,
        {model, oldModel}: {model: DevelopUserModel; oldModel: DevelopUserModel}
      ) => {
        this.logger.info('update reducer', state, model, oldModel);
        const pos = state.list.findIndex((m: DevelopUserModel) => {
          return m.id === oldModel.id;
        });
        if (pos !== -1) {
          state.list[pos] = model;
        }
        return state;
      },
      this.remove,
      (state: DevelopUsersState, model?: DevelopUserModel) => {
        this.logger.info('remove reducer', state, model);
        const pos = state.list.findIndex((m: DevelopUserModel) => {
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
    return DevelopUserModel.search(this.apiService, urlParams).pipe(
      tap(
        ({
          list,
          paginator,
        }: {
          list: DevelopUserModel[];
          paginator: Paginator;
        }) => {
          // ACL
          list.forEach((model: DevelopUserModel) => this.setAcl(model));

          this.loadDependencies(list);
        }
      ),
      map(
        ({
          list,
          paginator,
        }: {
          list: DevelopUserModel[];
          paginator: Paginator;
        }) => {
          return {
            status: StoreStatus.OK,
            list,
            paginator,
          } as DevelopUsersState;
        }
      ),
      catchError((error: ApplicationError | any) => {
        return of({status: StoreStatus.ERROR, error} as DevelopUsersState);
      })
    );
  }

  next(value: StreamInput) {
    this.setState(value);
  }

  setAcl(model: DevelopUserModel) {
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

  private loadDependencies(list: DevelopUserModel | DevelopUserModel[]) {
    this.logger.info('usersService: loadDependencies', list);

    if (!Array.isArray(list)) {
      list = [list];
    }

    if (!list.length) {
      return;
    }

    // let stateIds = [];
    // let cityIds = [];
    // for (const model of list) {
    //   if (model.stateId) {
    //     stateIds.push(model.stateId);
    //   }
    //   if (model.cityId) {
    //     cityIds.push(model.cityId);
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

  unshiftModel(model: DevelopUserModel) {
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

  updateModel(model: DevelopUserModel, oldModel: DevelopUserModel) {
    // Busca el modelo y reemplaza la referencia
    // const pos = list.findIndex(
    //   (m: User) => m.id === model.id
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

  removeModel(model: DevelopUserModel) {
    this.remove.next(model);
  }
}
