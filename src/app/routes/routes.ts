import {Routes} from '@angular/router';

import {AuthPageGuardService} from '@shared/services';
import {LayoutComponent} from '../layout/layout.component';
import {
  Error403Component,
  Error404Component,
  Error500Component,
  LayoutComponent as AuthLayoutComponent,
  LoginContainerComponent,
  ForgotPasswordContainerComponent,
  SignUpContainerComponent,
} from '@app/routes/pages';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', redirectTo: 'inicio', pathMatch: 'full'},
      {
        path: 'inicio',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'submodule',
        loadChildren: () =>
          import('./submodule/submodule.module').then((m) => m.SubmoduleModule),
      },
      // {
      //   path: 'cuenta',
      //   loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
      // },
      // {
      //   path: 'admin',
      //   children: [
      //     {
      //       path: 'proyectos',
      //       loadChildren: () => import('./admin/proyectos/proyectos.module').then(m => m.ProyectosModule)
      //     },
      //     {
      //       path: 'dominios-controlados',
      //       loadChildren: () => import('./admin/dominios/dominios.module').then(m => m.DominiosModule)
      //     },
      //     {
      //       path: 'usuarios',
      //       loadChildren: () => import('./admin/usuarios/usuarios.module').then(m => m.UsuariosModule)
      //     }
      //   ]
      // },
      {
        path: 'government-priorities',
        children: [
          {
            path: 'impact',
            loadChildren: () =>
              import(
                './modules/government-priorities/impact/impact/impact.module'
              ).then((m) => m.ImpactModule),
          },
          {
            path: 'management',
            children: [
              {
                path: '',
                loadChildren: () =>
                  import(
                    './modules/government-priorities/management/management.module'
                  ).then((m) => m.ManagementModule),
              },
            ],
          },
          {
            path: 'national',
            loadChildren: () =>
              import(
                './modules/government-priorities/national/national.module'
              ).then((m) => m.NationalModule),
          },
        ],
      },
      {
        path: 'develop',
        children: [
          {
            path: 'crud',
            loadChildren: () =>
              import('./develop/users/users.module').then((m) => m.UsersModule),
          },
          {
            path: 'upload-file',
            loadChildren: () =>
              import('./develop/upload-file/upload-file.module').then(
                (m) => m.UploadFileModule
              ),
          },
          {
            path: 'charts',
            loadChildren: () =>
              import('./develop/charts/charts.module').then(
                (m) => m.ChartsModule
              ),
          },
          {
            path: 'visor',
            loadChildren: () =>
              import('./develop/visor/visor.module').then((m) => m.VisorModule),
          },
          {
            path: 'domains',
            loadChildren: () =>
              import('./develop/domains/domains.module').then(
                (m) => m.DomainsModule
              ),
          },
          {
            path: 'translations',
            loadChildren: () =>
              import('./develop/translations/translations.module').then(
                (m) => m.TranslationsModule
              ),
          },
          {
            path: 'notifications',
            loadChildren: () =>
              import('./develop/notifications/notifications.module').then(
                (m) => m.NotificationsModule
              ),
          },
          {
            path: 'forbidden-resource',
            loadChildren: () =>
              import(
                './develop/forbidden-resource/forbidden-resource.module'
              ).then((m) => m.ForbiddenResourceModule),
          },
        ],
      },
    ],
  },

  // Not lazy-loaded routes

  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'ingresar',
        canActivate: [AuthPageGuardService],
        component: LoginContainerComponent,
      },
      {
        path: 'registro',
        canActivate: [AuthPageGuardService],
        component: SignUpContainerComponent,
      },
      // {
      //   path: 'registro-exitoso',
      //   canActivate: [AuthPageGuardService],
      //   component: SignUpSuccessComponent
      // },
      {
        path: 'olvido-contrasena',
        canActivate: [AuthPageGuardService],
        component: ForgotPasswordContainerComponent,
      },
    ],
  },
  {
    path: '403',
    component: Error403Component,
  },
  // {
  //   path: '404',
  //   component: Error404Component
  // },
  {
    path: '500',
    component: Error500Component,
  },

  // Not found
  {
    path: '**',
    // redirectTo: '404',
    component: Error404Component,
  },
];
