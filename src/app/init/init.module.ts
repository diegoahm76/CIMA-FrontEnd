import {Inject, LOCALE_ID, NgModule} from '@angular/core';
import {DOCUMENT, registerLocaleData} from '@angular/common';
import localEs from '@angular/common/locales/es-CO';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale, esLocale} from 'ngx-bootstrap/chronos';
import {ToastrModule} from 'ngx-toastr';
import {LoggerModule, NGXLogger, NgxLoggerLevel} from 'ngx-logger';

import {environment} from '@environments/environment';
import {AppService} from '@shared/services';
import {
  ExpiredTokenError,
  InvalidTokenError,
  NoTokenError,
} from '@shared/utils';

registerLocaleData(localEs);

// https://github.com/ocombe/ng2-translate/issues/218
export const createTranslateLoader = (http: HttpClient) => {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    ToastrModule.forRoot({
      timeOut: 7000,
      closeButton: false,
    }),
    LoggerModule.forRoot({level: NgxLoggerLevel.DEBUG}),
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'es-CO'},
    BsLocaleService,
    TranslateService,
    // {provide: ErrorHandler, useClass: SentryErrorHandler}
  ],
})
export class InitModule {
  constructor(
    @Inject(DOCUMENT) private document: any,
    router: Router,
    translate: TranslateService,
    localeService: BsLocaleService,
    appService: AppService,
    logger: NGXLogger
  ) {
    this.document.domain = environment.domain;

    // ngx-translate
    // This language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('es');
    // The lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('es');

    // ngx-bootstrap
    defineLocale('es', esLocale);
    localeService.use('es');

    try {
      // Lee la informacion de session en el LocalStorage
      appService.loadSessionInfoFromLocalStorage();
    } catch (e) {
      let loginRedirectFlag = false;
      let errorMsg: string;
      if (e instanceof NoTokenError) {
        logger.warn('NoTokenError', e.message);
      } else if (e instanceof InvalidTokenError) {
        loginRedirectFlag = true;
        errorMsg = 'el token es invalido';
      } else if (e instanceof ExpiredTokenError) {
        loginRedirectFlag = true;
        errorMsg = 'el token expiro';
      } else {
        logger.warn('Error', e.message);
      }

      if (loginRedirectFlag) {
        if (errorMsg) {
          logger.warn(`${errorMsg}, redirecciona al formulario de login`);
        }
        appService.clearSessionInfoFromLocalStorage();
        router.navigate(['ingresar']);
      }
    }
  }
}
