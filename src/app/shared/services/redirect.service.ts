import {Injectable} from '@angular/core';
import {Params} from '@angular/router';

import {NGXLogger} from 'ngx-logger';

import {Model} from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class RedirectService {
  private initialUrl: string;
  private url: string;
  private queryParams: Params;

  // Esta propiedad esta destinada a guardar un modelo temporalmente
  // mientras se hace una redireccion.
  // @TODO: investigar la forma mas apropiada de hacer esto.
  private model: Model;

  constructor(private logger: NGXLogger) {}

  saveInitialUrl(url: string) {
    this.initialUrl = url;
  }

  resetInitialUrl() {
    this.initialUrl = null;
  }

  getAndResetInitialUrl() {
    const url = this.initialUrl;
    this.initialUrl = null;
    return url;
  }

  saveUrl(url: string, queryParams?: Params) {
    if (url.includes('?')) {
      url = url.substr(0, url.indexOf('?'));
    }
    this.url = url;
    this.queryParams = queryParams;
  }

  getAndResetUrl(defaultUrl: {
    url: string;
    queryParams?: Params;
  }): {url: string; queryParams?: Params} {
    const url = this.url;
    const queryParams = this.queryParams;
    this.url = null;
    this.queryParams = null;
    if (url) {
      return {
        url,
        queryParams,
      };
    }
    return defaultUrl;
  }

  setModel(model: Model) {
    this.model = model;
  }

  getAndClearModel(): any {
    const model: any = this.model;
    this.model = null;
    return model;
  }
}
