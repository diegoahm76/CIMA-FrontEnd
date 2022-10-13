import {HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {ApiService} from '@shared/services';
import {Paginator, PropsMapping} from '@shared/interfaces';
import {Model} from '@shared/models';

const propsMapping: PropsMapping = {
  id: 'domainId',
  parentId: 'parentId',
  value: 'value',
  type: 'type',
  status: 'status',
};

export class DevelopDomainModel extends Model {
  parentId: number;
  value: string;
  type: string;
  status: string;

  get _label(): string {
    return this.value;
  }

  _treeKind: string;

  get _treeLabel(): string {
    return this.value;
  }

  _treeChildren: any[];
  _treeStatus: string;

  constructor() {
    super();
    this._treeKind = 'DevelopDomainModel';
  }

  static getInstance(data: {[prop: string]: any}): DevelopDomainModel {
    const model = new DevelopDomainModel();
    for (const prop in propsMapping) {
      if (!propsMapping.hasOwnProperty(prop)) {
        continue;
      }
      if (
        data[propsMapping[prop]] === undefined ||
        data[propsMapping[prop]] === null
      ) {
        continue;
      }

      model[prop] = data[propsMapping[prop]];
    }
    return model;
  }

  static search(
    apiService: ApiService,
    urlParams?: HttpParams
  ): Observable<{list: DevelopDomainModel[]; paginator: Paginator}> {
    return apiService.get('domains', urlParams).pipe(
      map((data: {[prop: string]: any}) => {
        const list = data.data.map((item: {[prop: string]: any}) =>
          DevelopDomainModel.getInstance(item)
        ) as DevelopDomainModel[];

        const paginator: Paginator = {
          total: data.total,
          perPage: data.perPage,
          currentPage: data.currentPage,
          lastPage: data.lastPage,
          // from: data.from,
          // to: data.to
        };

        return {list, paginator};
      })
    );
  }
}
