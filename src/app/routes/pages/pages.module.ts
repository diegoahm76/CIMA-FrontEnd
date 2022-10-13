import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// import {
//   GoogleLoginProvider,
//   SocialAuthServiceConfig,
//   SocialLoginModule,
// } from 'angularx-social-login';

import {environment} from '@environments/environment';
// import {ComponentsModule} from '@shared/components/components.module';
import {BasicComponentsModule} from '@shared/basic-components/basic-components.module';
import {DirectivesModule} from '@shared/directives/directives.module';
import {ForgotPasswordService, LoginService} from './shared/services';
import {
  ForgotPasswordFormComponent,
  LoginButtonComponent,
  LoginFormComponent,
  SignUpFormComponent,
} from './shared/components';
import {
  Error403Component,
  Error404Component,
  Error500Component,
  LayoutComponent,
  LoginContainerComponent,
  SignUpContainerComponent,
  ForgotPasswordContainerComponent,
  MaintenanceComponent,
  RecoverComponent,
} from '.';

/* Use this routes definition in case you want to make them lazy-loaded */
/*const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'recover', component: RecoverComponent },
    { path: 'lock', component: LockComponent },
    { path: 'maintenance', component: MaintenanceComponent },
    { path: '404', component: Error404Component },
    { path: '500', component: Error500Component },
];*/

// @TODO: deprecated
// const config = new AuthServiceConfig([
//   {
//     id: GoogleLoginProvider.PROVIDER_ID,
//     provider: new GoogleLoginProvider(environment.googleOAuthClientId)
//   }
//   // {
//   //   id: FacebookLoginProvider.PROVIDER_ID,
//   //   provider: new FacebookLoginProvider("Facebook-App-Id")
//   // },
//   // {
//   //   id: LinkedInLoginProvider.PROVIDER_ID,
//   //   provider: new LinkedInLoginProvider("LinkedIn-client-Id", false, 'en_US')
//   // }
// ]);

// @TODO: deprecated
// export function provideConfig() {
//   return config;
// }

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    // RouterModule.forChild(routes)

    // SocialLoginModule,

    BasicComponentsModule,
    DirectivesModule,
  ],
  declarations: [
    Error403Component,
    Error404Component,
    Error500Component,
    LayoutComponent,
    LoginContainerComponent,
    ForgotPasswordContainerComponent,
    SignUpContainerComponent,
    MaintenanceComponent,
    RecoverComponent,

    LoginButtonComponent,
    LoginFormComponent,
    ForgotPasswordFormComponent,
    SignUpFormComponent,
  ],
  exports: [
    // LoginComponent,
    // SignUpComponent,
    // RecoverComponent,
    // MaintenanceComponent,
    // Error403Component,
    // Error404Component,
    // Error500Component,
  ],
  providers: [
    // @TODO: deprecated
    // {
    //   provide: AuthServiceConfig,
    //   useFactory: provideConfig
    // },
    // {
    //   provide: 'SocialAuthServiceConfig',
    //   useValue: {
    //     autoLogin: false,
    //     providers: [
    //       {
    //         id: GoogleLoginProvider.PROVIDER_ID,
    //         provider: new GoogleLoginProvider(environment.googleOAuthClientId),
    //       },
    //       // {
    //       //   id: FacebookLoginProvider.PROVIDER_ID,
    //       //   provider: new FacebookLoginProvider('clientId')
    //       // },
    //       // {
    //       //   id: AmazonLoginProvider.PROVIDER_ID,
    //       //   provider: new AmazonLoginProvider(
    //       //     'clientId'
    //       //   )
    //       // }
    //     ],
    //   } as SocialAuthServiceConfig,
    // },
    LoginService,
    ForgotPasswordService,
  ],
})
export class PagesModule {}
