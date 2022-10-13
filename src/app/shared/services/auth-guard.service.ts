import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {Location} from '@angular/common';
import {Observable} from 'rxjs';

import {NGXLogger} from 'ngx-logger';

import {AppService} from './app.service';
import {RedirectService} from './redirect.service';
import {PermissionsService} from './permissions.service';
import {PermissionsUtil} from '@shared/utils';

@Injectable({
  providedIn: 'root',
})
export class AuthPageGuardService implements CanActivate {
  constructor(
    private router: Router,
    private appService: AppService,
    private logger: NGXLogger
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const user = this.appService.currentUser;

    if (user) {
      // Redirecciona a la pagina de inicio
      this.logger.info('usuario logueado, redirecciona a la pagina de inicio');
      this.router.navigate(['inicio']);
      return false;
    }

    return true;
  }
}

@Injectable({
  providedIn: 'root',
})
export class PrivatePageGuardService implements CanActivate {
  private redirectPages: {
    login: string;
    home: string;
    forbidden: string;
  };

  constructor(
    private router: Router,
    private location: Location,
    private appService: AppService,
    private permissionsService: PermissionsService,
    private redirectService: RedirectService,
    private logger: NGXLogger
  ) {
    this.redirectPages = {
      login: 'ingresar',
      home: 'inicio',
      forbidden: '403',
    };
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const user = this.appService.currentUser;

    if (!user) {
      // Guarda la url para hacer la redireccion despues del login del usuario
      this.redirectService.saveInitialUrl(this.location.path());

      // Se asegura de borrar el LocalStorage
      this.appService.clearSessionInfoFromLocalStorage();

      // Redirecciona a la pagina de login
      this.logger.info(
        'no hay usuario logueado, redirecciona al formulario de login'
      );
      this.router.navigate([this.redirectPages.login]);
      return false;
    }

    // Resetea el redirectService
    this.redirectService.resetInitialUrl();

    if (!route.data) {
      if (!route.data.id) {
        this.logger.warn('la ruta no tiene definido el "id"');
      }
      if (!route.data.action) {
        this.logger.warn('la ruta no tiene definido el "action"');
      }
      // Redirecciona a la pagina de inicio
      this.logger.info('redirecciona a la pagina de inicio');
      this.router.navigate([this.redirectPages.home]);
      return false;
    }

    const permissionsUtil = new PermissionsUtil(this.permissionsService);
    const hasAccess = permissionsUtil.isAllowed(
      `${route.data.id}.${route.data.action}`,
      user._role
    );
    if (!hasAccess) {
      this.logger.warn(
        `el usuario no tiene acceso a "${route.data.id}.${route.data.action}", redirecciona a la pagina "${this.redirectPages.forbidden}"`
      );

      // Redirecciona
      this.router.navigate([this.redirectPages.forbidden]);
      return false;
    }

    return true;
  }
}
