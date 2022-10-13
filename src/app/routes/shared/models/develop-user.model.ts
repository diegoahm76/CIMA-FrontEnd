import {HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {ApiService} from '@shared/services';
import {Paginator, PropsMapping} from '@shared/interfaces';
import {Model} from '@shared/models';
import {DevelopDomainModel} from './develop-domain.model';

const propsMapping: PropsMapping = {
  id: 'userId',
  stateId: 'stateId',
  cityId: 'cityId',
  name: 'name',
  surname: 'surname',
  email: 'email',
  birthday: 'birthday',
  role: 'role',
  status: 'status',
  lastSession: 'lastSession',
  created: 'created',
  updated: 'updated',

  fullName: 'fullName',
  state: 'state',
  city: 'city'
};

export class DevelopUserModel extends Model {
  stateId: number;
  cityId: number;
  name: string;
  surname: string;
  email: string;
  birthday: Date;
  role: string;
  status: string;
  lastSession: Date;
  created: Date;
  updated: Date;

  fullName: string;
  state?: DevelopDomainModel;
  city?: DevelopDomainModel;

  get _role(): string {
    return this.role;
  }

  static getInstance(data: {[prop: string]: any}): DevelopUserModel {
    const model = new DevelopUserModel();
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

      if (['created', 'updated', 'lastSession'].includes(prop)) {
        model[prop] = new Date(data[propsMapping[prop]]);
      } else if (['birthday'].includes(prop)) {
        // Hace la correccion de la zona horaria del cliente
        const date = new Date(data[propsMapping[prop]]);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        model[prop] = date;
      } else if (['state', 'city'].includes(prop)) {
        model[prop] = DevelopDomainModel.getInstance(data[propsMapping[prop]]);
      } else {
        model[prop] = data[propsMapping[prop]];
      }
    }
    return model;
  }

  static search(
    apiService: ApiService,
    urlParams?: HttpParams
  ): Observable<{list: DevelopUserModel[]; paginator: Paginator}> {
    return apiService.get('users', urlParams).pipe(
      map((data: {[prop: string]: any}) => {
        const list = data.data.map((item: {[prop: string]: any}) =>
          DevelopUserModel.getInstance(item)
        ) as DevelopUserModel[];

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
