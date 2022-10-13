import {Injectable} from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import {Params} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

import {environment} from '@environments/environment';
import {AppService} from './app.service';
import {ApplicationError} from '@shared/utils';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private appService: AppService,
    private logger: NGXLogger
  ) {}

  get(url: string, urlParams?: HttpParams): Observable<Params> {
    let headers = new HttpHeaders();
    const token = this.appService.token;
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    const options = {
      headers,
      params: urlParams,
    };
    return this.http
      .get(`${environment.apiBase}/${url}`, options)
      .pipe(
        catchError((response: HttpErrorResponse) =>
          throwError(() => this.parseError(response))
        )
      );
  }

  save(
    url: string,
    data?: {[prop: string]: any},
    props = [],
    forceMethod = null
  ): Observable<Params> {
    let copy: {[prop: string]: any} = Object.assign({}, data);
    let method: string;
    url = `${environment.apiBase}/${url}`;
    if (forceMethod) {
      method = forceMethod;
    } else {
      if (!copy.id) {
        method = 'post';
      } else {
        const id: number = copy.id;
        delete copy.id;

        if (!props.length) {
          method = 'put';
        } else {
          method = 'patch';
        }
        url = `${url}/${id}`;
      }
    }

    if (method === 'patch') {
      const copy2: {[prop: string]: any} = {};
      for (const prop in copy) {
        if (props.includes(prop)) {
          copy2[prop] = copy[prop];
        }
      }
      copy = copy2;
    }

    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    const token = this.appService.token;
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http[method](url, copy, {headers})
      .pipe
      // catchError((response: HttpErrorResponse) =>
      //   // @TODO
      //   // throwError(() => this.parseError(response))
      // )
      ();
  }

  delete(url: string): Observable<Params> {
    let headers = new HttpHeaders();
    const token = this.appService.token;
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http
      .delete(`${environment.apiBase}/${url}`, {headers})
      .pipe(
        catchError((response: HttpErrorResponse) =>
          throwError(() => this.parseError(response))
        )
      );
  }

  private parseError(errorResponse: HttpErrorResponse): ApplicationError {
    const errorApp = new ApplicationError(errorResponse.status);

    if (
      errorResponse.headers.has('content-type') &&
      errorResponse.headers.get('content-type').includes('application/json') &&
      errorResponse.error
    ) {
      const errorBody: {
        message?: string;
        errors?: {[prop: string]: string | string[]};
      } = errorResponse.error;

      // Mensaje de error
      if (errorBody.message) {
        // Se traduce el mensaje de error
        errorApp.setMessage(
          this.translate.get(`server_messages.${errorBody.message}`)
        );
      }

      // Errores de campo
      if (errorBody.hasOwnProperty('errors')) {
        for (const field in errorBody.errors) {
          if (errorBody.errors.hasOwnProperty(field)) {
            const fieldErrors: Observable<string>[] = [];
            if (!Array.isArray(errorBody.errors[field])) {
              errorBody.errors[field] = [errorBody.errors[field] as string];
            }
            for (const fieldError of errorBody.errors[field]) {
              // Se traduce el mensaje de error
              fieldErrors.push(this.translate.get(`validation.${fieldError}`));
            }
            errorApp.addAttr(field, fieldErrors);
          }
        }
      }
    }

    if (!errorApp.message$) {
      // Mensajes de error por defecto
      let codeError: string;
      if ([401, 404, 422].includes(errorResponse.status)) {
        codeError = String(errorResponse.status);
      } else {
        codeError = 'default';
      }
      const message = `http_codes.${codeError}`;
      errorApp.setMessage(this.translate.get(message));
    }

    return errorApp;
  }
}
