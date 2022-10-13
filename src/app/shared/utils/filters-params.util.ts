import {DatePipe} from '@angular/common';
import {Params} from '@angular/router';
import {HttpParams} from '@angular/common/http';

export class FiltersParamsUtil {
  private readonly pageParam: string;
  private readonly datePipe: DatePipe;

  private _params: Params;
  private _queryParams: {[param: string]: string};
  private _httpParams: HttpParams;
  private _additionalHttpParams: {[key: string]: string | string[]};

  private _updateQueryParamsFlag: boolean;

  constructor(pageParam?: string, datePipe?: DatePipe) {
    this.pageParam = pageParam;
    this.datePipe = datePipe;
  }

  setAdditionalHttpParams(additionalHttpParams: {
    [key: string]: string | string[];
  }) {
    this._additionalHttpParams = additionalHttpParams;
  }

  filterQueryParams(
    queryParams: Params,
    allowedParams: Array<string | {param: string; type: string}>
  ) {
    this._updateQueryParamsFlag = false;

    const params: Params = {};

    let allowedParamFlag;
    let allowedParamName;
    let paramValue;
    let urlParamValue;
    for (const param in queryParams) {
      if (!queryParams.hasOwnProperty(param)) {
        continue;
      }

      allowedParamFlag = false;
      paramValue = null;
      urlParamValue = null;
      for (const item of allowedParams) {
        if (typeof item === 'object') {
          allowedParamName = item.param;
          if (item.type === 'date') {
            if (queryParams[param]) {
              // Hace la correccion de la zona horaria del cliente
              const date = new Date(queryParams[param]);
              date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
              paramValue = date;
              urlParamValue = queryParams[param];
            }
          } else if (item.type === 'rangeDates') {
            if (queryParams[param]) {
              paramValue = queryParams[param].split(',').map((v) => {
                // Hace la correccion de la zona horaria del cliente
                const date = new Date(v);
                date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
                return date;
              });
              urlParamValue = queryParams[param];
            }
          } else {
            paramValue = queryParams[param];
            urlParamValue = queryParams[param];
          }
        } else {
          allowedParamName = item;
          paramValue = queryParams[param];
          urlParamValue = queryParams[param];
        }
        if (allowedParamName === param) {
          allowedParamFlag = true;
          break;
        }
      }

      if (allowedParamFlag) {
        params[param] = paramValue;
      } else {
        this._updateQueryParamsFlag = true;
      }
    }

    let resetPageFlag = false;
    if (this.pageParam) {
      // Pagina inicial
      if (queryParams[this.pageParam]) {
        const page = +queryParams[this.pageParam];
        params[this.pageParam] = page > 0 ? page : 1;
      } else {
        resetPageFlag = true;
      }
    }

    this.setParams(params, resetPageFlag);
  }

  private refreshQueryParams() {
    const queryParams: {[param: string]: string} = {};
    let value;
    for (const param in this.params) {
      if (!this.params.hasOwnProperty(param)) {
        continue;
      }
      if (
        this.pageParam &&
        param === this.pageParam &&
        this.params[param] === 1
      ) {
        continue;
      }
      if (
        this.params[param] === '' ||
        this.params[param] === null ||
        this.params[param] === undefined
      ) {
        continue;
      }

      value =
        this.params[param] instanceof Array
          ? this.params[param]
          : [this.params[param]];

      value = value.map((v) => {
        let newV;
        if (v !== null && v !== undefined && typeof v !== 'string') {
          if (v instanceof Date && this.datePipe) {
            newV = this.datePipe.transform(v, 'yyyy-MM-dd');
          } else {
            newV = String(v);
          }
        } else {
          newV = v;
        }
        return newV;
      });
      queryParams[param] = value.join(',');
    }
    this._queryParams = queryParams;
  }

  private refreshHttpParams() {
    const params: {[param: string]: string | string[]} = {};
    let value;
    for (const param in this.params) {
      if (!this.params.hasOwnProperty(param)) {
        continue;
      }
      if (
        this.params[param] === '' ||
        this.params[param] === null ||
        this.params[param] === undefined
      ) {
        continue;
      }

      value =
        this.params[param] instanceof Array
          ? this.params[param]
          : [this.params[param]];

      value = value.map((v) => {
        let newV;
        if (v !== null && v !== undefined && typeof v !== 'string') {
          if (v instanceof Date && this.datePipe) {
            newV = this.datePipe.transform(v, 'yyyy-MM-dd');
          } else {
            newV = String(v);
          }
        } else {
          newV = v;
        }
        return newV;
      });
      params[param] = value.join('|');
    }
    if (this._additionalHttpParams) {
      Object.assign(params, this._additionalHttpParams);
    }
    this._httpParams = new HttpParams({fromObject: params});
  }

  setParams(params: Params, resetPage = true) {
    if (resetPage && this.pageParam) {
      params[this.pageParam] = 1;
    }

    this._params = params;
    this.refreshQueryParams();
    this.refreshHttpParams();
  }

  setParam(param: string, value: any) {
    this._params[this.pageParam] = value;
    this.refreshQueryParams();
    this.refreshHttpParams();
  }

  get params() {
    return this._params;
  }

  get queryParams() {
    return this._queryParams;
  }

  get httpParams() {
    return this._httpParams;
  }

  get updateQueryParamsFlag() {
    return this._updateQueryParamsFlag;
  }
}
