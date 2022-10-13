import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';

import {TranslateModule} from '@ngx-translate/core';

import {PrivatePageGuardService} from '@shared/services';
import {TranslationsComponent} from './translations.component';

const routes: Routes = [
  {
    path: '',
    data: {id: 'module.develop.translations', action: 'view'},
    canActivate: [PrivatePageGuardService],
    component: TranslationsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [
    TranslationsComponent
  ],
  exports: [
    RouterModule
  ]
})
export class TranslationsModule {}
