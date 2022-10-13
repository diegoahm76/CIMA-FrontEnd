import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {HttpParams} from '@angular/common/http';

import {NGXLogger} from 'ngx-logger';

import {UrlService} from '@shared/services';
import {FiltersParamsUtil, StaticSelectOptionsState} from '@shared/utils';
import {TreeState} from '../../shared/utils';

@Component({
  selector: 'app-domains-filters',
  templateUrl: './domains-filters-container.component.html',
})
export class DomainsFiltersContainerComponent implements OnInit {
  @Input()
  state: TreeState;
  @Input()
  typesState: StaticSelectOptionsState;
  @Output()
  searchClick: EventEmitter<HttpParams>;

  filtersParams: FiltersParamsUtil;

  constructor(
    private route: ActivatedRoute,
    private urlService: UrlService,
    private logger: NGXLogger
  ) {
    this.searchClick = new EventEmitter<HttpParams>();

    this.filtersParams = new FiltersParamsUtil();
  }

  ngOnInit() {
    this.initFiltersParams();
  }

  private initFiltersParams() {
    const additionalHttpParams: {[param: string]: string | string[]} = {
      order: 'value',
      pageSize: '500',
    };
    this.filtersParams.setAdditionalHttpParams(additionalHttpParams);

    // Filtros iniciales de busqueda
    this.filtersParams.filterQueryParams(this.route.snapshot.queryParams, [
      'type',
    ]);

    if (this.filtersParams.updateQueryParamsFlag) {
      this.urlService.updateQueryParams(
        this.route,
        this.filtersParams.queryParams
      );
    }

    if (Object.keys(this.filtersParams.params).length) {
      // Si no hay filtros seteados, no emite la busqueda
      this.searchClick.emit(this.filtersParams.httpParams);
    }
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
}
