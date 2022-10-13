import {Injectable} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';

import {environment} from '@environments/environment';
import {WindowRef} from './window.service';
import {ApplicationError, JWTUtil} from '@shared/utils';
import {TokenUserModel} from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private _token?: string;
  private _user?: TokenUserModel;

  constructor(
    private translate: TranslateService,
    private toastr: ToastrService,
    private windowRef: WindowRef,
    private logger: NGXLogger
  ) {}

  get token(): string {
    return this._token;
  }

  set token(token: string) {
    this._token = token;
  }

  get currentUser(): TokenUserModel {
    return this._user;
  }

  set currentUser(user: TokenUserModel) {
    this._user = user;
  }

  saveSessionInfoToLocalStorage() {
    this.windowRef.nativeWindow.localStorage.setItem(
      environment.appId,
      this.token
    );
  }

  loadSessionInfoFromLocalStorage() {
    const token = this.windowRef.nativeWindow.localStorage.getItem(
      environment.appId
    );

    if (token) {
      const payload = JWTUtil.verifyToken(token, environment.publicKey);
      this.token = token;
      this.currentUser = TokenUserModel.getInstance(payload.data);
    } else {
      this._token = null;
      this._user = null;
    }
  }

  clearSessionInfoFromLocalStorage() {
    this._token = null;
    this._user = null;
    this.windowRef.nativeWindow.localStorage.clear();
  }

  toastErrorApplication(error: ApplicationError | any) {
    if (error instanceof ApplicationError) {
      error.message$.subscribe((res: string) => {
        this.toastr.error(res, 'Error!');
      });
    } else {
      // Error no controlado
      this.translate.get('http_codes.default').subscribe((res: string) => {
        this.toastr.error(res, 'Error!');
      });
    }
  }
}
