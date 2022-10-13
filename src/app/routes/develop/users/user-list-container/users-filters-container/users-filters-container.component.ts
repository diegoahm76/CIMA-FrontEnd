import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

import {NGXLogger} from 'ngx-logger';

import {UrlService} from '@shared/services';
import {DevelopDomainsService} from '@app/routes/shared/services';
import {FiltersParamsUtil, StaticSelectOptionsState} from '@shared/utils';
import {DevelopDomainsState, DevelopUsersState} from '@app/routes/shared/utils';
import {DevelopDomainStatusEnum} from '@app/routes/shared/enums';

@Component({
  selector: 'app-users-filters',
  templateUrl: './users-filters-container.component.html',
})
export class UsersFiltersContainerComponent implements OnInit {
  @Input()
  state$: Observable<DevelopUsersState>;
  @Input()
  statesState$: Observable<DevelopDomainsState>;
  @Input()
  citiesState$: Observable<DevelopDomainsState>;
  @Input()
  rolesState$: Observable<StaticSelectOptionsState>;
  @Input()
  statusesState$: Observable<StaticSelectOptionsState>;
  @Output()
  searchClick: EventEmitter<HttpParams>;
  @Output()
  newInModalClick: EventEmitter<void>;
  @Output()
  newClick: EventEmitter<void>;

  filtersParams: FiltersParamsUtil;

  constructor(
    private route: ActivatedRoute,
    private urlService: UrlService,
    private domainsService: DevelopDomainsService,
    private logger: NGXLogger
  ) {
    this.searchClick = new EventEmitter<HttpParams>();
    this.newInModalClick = new EventEmitter<void>();
    this.newClick = new EventEmitter<void>();

    this.filtersParams = new FiltersParamsUtil('page');
  }

  ngOnInit() {
    this.initFiltersParams();
  }

  private initFiltersParams() {
    const additionalHttpParams: {[param: string]: string | string[]} = {
      orden: 'fullName',
      items: '3',
    };
    this.filtersParams.setAdditionalHttpParams(additionalHttpParams);

    // Filtros iniciales de busqueda
    this.filtersParams.filterQueryParams(
      this.route.snapshot.queryParams,
      ['search', 'stateId', 'cityId', 'role', 'status']
    );

    if (this.filtersParams.updateQueryParamsFlag) {
      this.urlService.updateQueryParams(
        this.route,
        this.filtersParams.queryParams
      );
    }

    this.logger.info('search emit', this.filtersParams.httpParams);
    this.searchClick.emit(this.filtersParams.httpParams);
  }

  search(params: Params) {
    this.filtersParams.setParams(params);
    // Actualiza los query params en la URL del navegador
    this.urlService.updateQueryParams(
      this.route,
      this.filtersParams.queryParams
    );
    this.searchClick.emit(this.filtersParams.httpParams);
  }

  changePage(page: number) {
    this.filtersParams.setParam('page', page);
    // Actualiza los query params en la URL del navegador
    this.urlService.updateQueryParams(
      this.route,
      this.filtersParams.queryParams
    );
    this.searchClick.emit(this.filtersParams.httpParams);
  }

  onChangeStateId(stateId: string) {
    const citiesUtil = this.domainsService.getInstance(
      'filtersCities'
    );
    citiesUtil.next({
      urlParams: new HttpParams({
        fromObject: {
          parentId: stateId,
          status: DevelopDomainStatusEnum.ACTIVE,
          orderBy: 'nombre'
        }
      })
    });
  }
}
