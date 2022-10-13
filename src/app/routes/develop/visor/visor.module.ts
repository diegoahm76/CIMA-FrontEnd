import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';

import {TranslateModule} from '@ngx-translate/core';

import {PrivatePageGuardService} from '@shared/services';
import {VisorComponent} from './visor.component';
import {ComponentsModule} from '@app/shared/components/components.module';

const routes: Routes = [
  {
    path: '',
    data: {id: 'module.develop.visor', action: 'view'},
    canActivate: [PrivatePageGuardService],
    component: VisorComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    TranslateModule,

    ComponentsModule,
  ],
  declarations: [VisorComponent],
  exports: [RouterModule],
})
export class VisorModule {}
