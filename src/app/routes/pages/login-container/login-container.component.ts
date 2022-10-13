import {Component, OnDestroy, OnInit} from '@angular/core';
import {Params, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';

// import {
//   GoogleLoginProvider,
//   SocialAuthService,
//   SocialUser,
// } from 'angularx-social-login';
// import {CustomValidators} from 'ng2-validation';
// import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';

import {environment} from '@environments/environment';
import {MenuService} from '@app/core/menu/menu.service';
import {AppService, RedirectService, WindowRef} from '@shared/services';
import {LoginService, LoginState} from '../shared/services';
import {menu} from '@app/routes/menu';
import {StoreStatus} from '@shared/enums';

@Component({
  templateUrl: './login-container.component.html',
  styleUrls: ['./login-container.component.scss'],
})
export class LoginContainerComponent implements OnDestroy, OnInit {
  private unsubscribe = new Subject<void>();

  state$: Observable<LoginState>;

  // loading = false;

  // buttonsDisabled = false;

  private windowObjectReference;

  constructor(
    private router: Router,
    // private socialAuthService: SocialAuthService,
    // private toastr: ToastrService,
    private windowRef: WindowRef,
    private appService: AppService,
    private menuService: MenuService,
    private redirectService: RedirectService,
    private loginService: LoginService,
    private logger: NGXLogger
  ) {}

  ngOnInit() {
    this.initServices();
    this.initSubscriptions();
    this.initEventListeners();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();

    this.windowRef.nativeWindow.removeEventListener(
      'message',
      this.handleMessage,
      false
    );
  }

  private initServices() {
    this.state$ = this.loginService.getState();
    this.loginService.next({
      status: StoreStatus.INITIATED,
    });
  }

  private initSubscriptions() {
    this.state$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((state: LoginState) => {
        if (state.status === StoreStatus.OK) {
          if (
            (state.authAppToken || state.authAppFToken) &&
            this.windowObjectReference
          ) {
            // Cierra el popup
            this.windowObjectReference.close();
          }

          this.appService.token = state.token;
          this.appService.currentUser = state.model;

          // Guarda la informacion de session en el LocalStorage
          this.appService.saveSessionInfoToLocalStorage();

          // Recalcula los permisos sobre los items del menu principal
          // @TODO
          this.menuService.menuItems = [];
          this.menuService.addMenu(menu);
          // this.menuService.setMenu(menu);

          // Redirecciona
          let url = this.redirectService.getAndResetInitialUrl();
          if (url) {
            this.logger.info(`redireccionando a "${url}"...`);
            this.router.navigateByUrl(url);
          } else {
            url = 'inicio';
            this.logger.info(`redireccionando a "${url}"...`);
            this.router.navigate([url]);
          }
        } else if (state.status === StoreStatus.ERROR) {
          if (state.authAppToken) {
            // Cierra el popup
            this.windowObjectReference.close();

            // @TODO: notificar al usuario del error (en el componente ui)
          }
        }
      });
  }

  handleMessage = (event) => {
    if (event.origin !== environment.authAppUrl) {
      // Descarta mensajes de origenes no autorizados
      return;
    }

    const data = JSON.parse(event.data);

    if (data.event === 'id' && this.windowObjectReference) {
      this.windowObjectReference.postMessage(
        JSON.stringify({
          event: data.event,
          appAlias: environment.appAlias,
          appUrl: environment.appUrl,
          showInternalLogin: true,
          showExternalLogin: true,
          showSignUp: true,
        }),
        environment.authAppUrl
      );
    }

    if (data.event === 'login') {
      if (data.value.ft) {
        this.loginService.next({
          authAppFToken: data.value.ft,
        });
      } else {
        this.loginService.next({
          authAppToken: data.value.t,
        });
      }
    }
  };

  private initEventListeners() {
    this.windowRef.nativeWindow.addEventListener(
      'message',
      this.handleMessage,
      false
    );
  }

  submit(data: Params) {
    this.loginService.next({
      data,
    });
  }

  openSignInPopUp() {
    // Obliga a quitar el mensaje de error si esta presente
    this.loginService.next({
      status: StoreStatus.INITIATED,
    });

    if (!this.windowObjectReference || this.windowObjectReference.closed) {
      // Crea el popup
      const width = 500;
      const height = 600;
      const x =
        this.windowRef.nativeWindow.top.outerWidth / 2 +
        this.windowRef.nativeWindow.top.screenX -
        width / 2;
      const y =
        this.windowRef.nativeWindow.top.outerHeight / 2 +
        this.windowRef.nativeWindow.top.screenY -
        height / 2;
      this.windowObjectReference = this.windowRef.nativeWindow.open(
        `${environment.authAppUrl}`,
        'authPopup',
        `top=${y}, left=${x}, width=${width}, height=${height}, menubar=no, location=no, resizable=no, scrollbars=no, status=no, toolbar=no, directories=no, copyhistory=no`
      );
    } else {
      // Hace focus del popup
      this.windowObjectReference.focus();
    }
  }

  // socialSignIn(provider: string) {
  //   let socialProviderId: string;
  //   // @TODO: descomentar
  //   /*if(provider == 'facebook'){
  //     socialProviderId = FacebookLoginProvider.PROVIDER_ID;
  //   }else */ if (
  //     provider === 'google'
  //   ) {
  //     socialProviderId = GoogleLoginProvider.PROVIDER_ID;
  //   }
  //
  //   this.buttonsDisabled = true;
  //   this.socialAuthService.signIn(socialProviderId).then(
  //     (userData: SocialUser) => {
  //       this.socialAuth(provider, userData);
  //     },
  //     () => {
  //       this.buttonsDisabled = false;
  //     }
  //   );
  // }

  // private socialAuth(socialProvider: string, userData: SocialUser) {
  //   this.logger.info('socialAuth', socialProvider, userData);
  //
  //   const params: Params = {
  //     provider: socialProvider,
  //     idToken: userData.idToken,
  //   };
  //
  //   this.buttonsDisabled = true;
  //   this.apiService
  //     .save('auth.json', params)
  //     .pipe(
  //       // @TODO: borrar esta linea que esta simulando un delay en el back
  //       delay(2000),
  //       map((data: {[prop: string]: any}) => {
  //         return {
  //           token: data['access_token'],
  //           usuario: Usuario.getInstance(data['usuario']),
  //         };
  //       })
  //     )
  //     .subscribe(
  //       ({token, usuario}: {token: string; usuario: Usuario}) => {
  //         // @TODO
  //         // this.appService.token = token;
  //         // this.appService.currentUser = usuario;
  //         //
  //         // // Guarda la informacion de session en el LocalStorage
  //         // this.appService.saveSessionInfoToLocalStorage();
  //         //
  //         // // Recalcula el ACL del menu principal
  //         // this.menuService.menuItems = [];
  //         // this.menuService.addMenu(menu);
  //         //
  //         // // Redirecciona
  //         // let url = this.redirectService.getAndResetInitialUrl();
  //         // if (!url) {
  //         //   url = 'inicio';
  //         //   this.logger.info(`redireccionando a "${url}"...`);
  //         //   this.router.navigate([url]);
  //         // } else {
  //         //   this.logger.info(`redireccionando a "${url}"...`);
  //         //   this.router.navigateByUrl(url);
  //         // }
  //       },
  //       (error: ApplicationError | any) => {
  //         this.buttonsDisabled = false;
  //
  //         // @TODO: pendiente
  //         // if(error.subcode === 1){
  //         //   // No existe la cuenta
  //         //   this.socialOptions.userData = userData;
  //         // }else{
  //         //   this.socialOptions.error = error;
  //         //   this.socialOptions.userData = null;
  //         // }
  //       }
  //     );
  // }
}
