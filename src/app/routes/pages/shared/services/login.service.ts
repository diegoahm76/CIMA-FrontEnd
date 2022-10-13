import {Injectable} from '@angular/core';
import {Params} from '@angular/router';
import {BehaviorSubject, concat, forkJoin, Observable, of, timer} from 'rxjs';
import {catchError, map, shareReplay, switchMap} from 'rxjs/operators';

import {NGXLogger} from 'ngx-logger';

import {environment} from '@environments/environment';
import {ApiService, PermissionsService, Store} from '@shared/services';
import {
  ApplicationError,
  ExpiredTokenError,
  InvalidTokenError,
  JWTUtil,
  NoTokenError,
} from '@shared/utils';
import {StoreStatus} from '@shared/enums';
import {TokenUserModel} from '@shared/models';

interface StreamInput {
  status?: StoreStatus;
  data?: Params;
  authAppToken?: string;
  authAppFToken?: string;
}

export interface LoginState {
  status: StoreStatus;
  error?: ApplicationError | any;
  authAppToken?: string;
  authAppFToken?: string;
  token?: string;
  model?: TokenUserModel;
}

@Injectable()
export class LoginService extends Store<StreamInput, LoginState> {
  constructor(
    private permissionsService: PermissionsService,
    private apiService: ApiService,
    private logger: NGXLogger
  ) {
    super();

    this.subject = new BehaviorSubject<StreamInput>({
      status: StoreStatus.INITIATED,
    });

    this.initState();
  }

  protected initState() {
    this.state$ = this.subject.pipe(
      switchMap(({status, data, authAppToken, authAppFToken}: StreamInput) => {
        if (status === StoreStatus.INITIATED) {
          return of({status});
        }

        return concat(
          of({status: StoreStatus.LOADING}),
          forkJoin([
            this.getLoginSource$(data, authAppToken, authAppFToken),
            timer(environment.minDelay),
          ]).pipe(map(([state, dummy]: [LoginState, any]) => state))
        );
      }),
      shareReplay(1)
    );
  }

  private getLoginSource$(
    data: Params,
    authAppToken: string,
    authAppFToken: string
  ): Observable<any> {
    let fakeLogin = false;
    if (!authAppToken && ['develop', 'test'].includes(environment.env)) {
      if (authAppFToken) {
        fakeLogin = true;
      } else {
        if (data.email) {
          const testEmails = ['user1@test.com'];
          if (testEmails.includes(data.email)) {
            fakeLogin = true;
          }
        } else if (data.user) {
          const testUsers = ['user1'];
          if (testUsers.includes(data.user)) {
            fakeLogin = true;
          }
        }
      }
    }

    let loginSource$: Observable<any>;
    if (!fakeLogin) {
      loginSource$ = this.doQuery(authAppToken, data);
    } else {
      let userData: {name: string; surname: string; email: string};
      if (authAppFToken) {
        const parts = authAppFToken.split('.');
        const payload = JWTUtil.base64UrlDecodeToJSON(parts[1]);
        userData = {
          name: payload.data.nombres,
          surname: payload.data.apellidos,
          email: payload.data.email,
        };
      } else {
        const emailParts = data.email.split(/[@\.]/);
        userData = {
          name: emailParts[0],
          surname: emailParts[1],
          email: data.email,
        };
      }

      const jwtData = {
        usuarioId: 1,
        nombres: userData.name,
        apellidos: userData.surname,
        email: userData.email,
        rol: 'admin',
      };
      const token = JWTUtil.createToken(
        jwtData,
        environment.privateKey,
        environment.jwtAud,
        environment.jwtIss,
        '25aa54ba-a9e8-11ec-b9b7-02e164a8ad10'
      );

      loginSource$ = of<LoginState>({
        status: StoreStatus.OK,
        authAppFToken,
        token,
        model: TokenUserModel.getInstance(jwtData),
      });
    }

    return loginSource$;
  }

  private doQuery(authAppToken?: string, data?: Params): Observable<any> {
    let url = 'autenticacion';
    if (authAppToken) {
      url += '/token';
      data = {
        token: authAppToken,
      };
    }
    return this.apiService.save(url, data).pipe(
      map(({token}: Params) => {
        const payload = JWTUtil.verifyToken(token, environment.publicKey);
        this.logger.info('payload', payload);
        return {
          status: StoreStatus.OK,
          authAppToken,
          token,
          model: TokenUserModel.getInstance(payload.data),
        } as LoginState;
      }),
      catchError((error: ApplicationError | any) => {
        if (error instanceof NoTokenError) {
          this.logger.warn('NoTokenError', error.message);
        } else if (error instanceof InvalidTokenError) {
          this.logger.warn('el token es invalido');
        } else if (error instanceof ExpiredTokenError) {
          this.logger.warn('el token expiro');
        } else {
          this.logger.warn('Error', error.message);
        }
        return of({
          status: StoreStatus.ERROR,
          authAppToken,
          error,
        } as LoginState);
      })
    );
  }

  next(value: StreamInput) {
    this.setState(value);
  }
}
