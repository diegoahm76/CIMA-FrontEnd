import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

import {ModalDirective} from 'ngx-bootstrap/modal';
import {NGXLogger} from 'ngx-logger';

import {RedirectService, StaticSelectOptionsService} from '@shared/services';
import {DevelopDomainsService, DevelopUsersService} from '@app/routes/shared/services';
import {ModalOptions, StaticSelectOptionsState} from '@shared/utils';
import {DevelopDomainsState, DevelopDomainsUtil, DevelopUsersState, DevelopUsersUtil} from '@app/routes/shared/utils';
import {UsersFiltersContainerComponent} from './users-filters-container/users-filters-container.component';
import {DevelopDomainTypeEnum, DevelopUserRoleValues, DevelopUserStatusValues} from '@app/routes/shared/enums';
import {DevelopUserModel} from '@app/routes/shared/models';

@Component({
  templateUrl: './user-list-container.component.html',
  styleUrls: ['./user-list-container.component.scss'],
})
export class UserListContainerComponent implements OnInit {
  @ViewChild('modal', {static: true}) modal: ModalDirective;
  @ViewChild('filters', {static: true})
  filtersComponent: UsersFiltersContainerComponent;

  modalOptions: ModalOptions;
  selectedModel: DevelopUserModel;

  usersUtil: DevelopUsersUtil;
  usersState$: Observable<DevelopUsersState>;

  // Selects
  statesState$: Observable<DevelopDomainsState>;
  filtersCitiesState$: Observable<DevelopDomainsState>;
  modalCitiesState$: Observable<DevelopDomainsState>;
  rolesState$: Observable<StaticSelectOptionsState>;
  statusesState$: Observable<StaticSelectOptionsState>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private redirectService: RedirectService,
    private staticSelectOptionsService: StaticSelectOptionsService,
    private usersService: DevelopUsersService,
    private domainsService: DevelopDomainsService,
    private logger: NGXLogger
  ) {
    this.modalOptions = new ModalOptions();
  }

  ngOnInit() {
    this.initServices();
  }

  private initServices() {
    this.usersUtil = this.usersService.getInstance('mainList');
    this.usersState$ = this.usersUtil.getState();

    const statesUtil = this.domainsService.getInstance('states');
    this.statesState$ = statesUtil.getState();
    statesUtil.next({
      urlParams: new HttpParams({
        fromObject: {
          parentId: 'root',
          type: DevelopDomainTypeEnum.LOCATION
        }
      })
    });

    let citiesUtil: DevelopDomainsUtil;

    citiesUtil = this.domainsService.getInstance('filtersCities');
    this.filtersCitiesState$ = citiesUtil.getState();

    citiesUtil = this.domainsService.getInstance('modalCities');
    this.modalCitiesState$ = citiesUtil.getState();

    const rolesUtil = this.staticSelectOptionsService.getInstance('roles');
    this.rolesState$ = rolesUtil.getState();
    rolesUtil.next({
      list: Object.entries(DevelopUserRoleValues)
        .map(([value, label]: [string, string]) => {
          return {value, label};
        })
    });

    const statusesUtil = this.staticSelectOptionsService.getInstance('statuses');
    this.statusesState$ = statusesUtil.getState();
    statusesUtil.next({
      list: Object.entries(DevelopUserStatusValues)
        .map(([value, label]: [string, string]) => {
          return {value, label};
        })
    });
  }

  search(urlParams: HttpParams) {
    this.usersUtil.next({
      urlParams,
    });
  }

  changePage(page: number) {
    this.filtersComponent.changePage(page);
  }

  showFormInModal(model?: DevelopUserModel) {
    this.selectedModel = model;
    this.modalOptions.modal = 'user-form';
    this.modal.show();
  }

  showForm(model?: DevelopUserModel) {
    // Guarda la url actual
    this.redirectService.saveUrl(
      this.router.url,
      this.route.snapshot.queryParams
    );

    if (model) {
      // Guarda temporalmente el modelo para que el resolver no tenga
      // necesidad de hacer el llamado al servicio
      this.redirectService.setModel(model);
    }
  }

  onModelCreated(model: DevelopUserModel) {
    this.usersUtil.unshiftModel(model);
  }

  onModelUpdated({model, oldModel}: {model: DevelopUserModel; oldModel: DevelopUserModel}) {
    this.usersUtil.updateModel(model, oldModel);
  }

  confirmModelDeletion(model: DevelopUserModel) {
    this.selectedModel = model;
    this.modalOptions.modal = 'delete-user';
    this.modal.show();
  }

  onDeletedModel(model: DevelopUserModel) {
    this.usersUtil.removeModel(model);
  }
}
