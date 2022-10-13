import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';

import {PrivatePageGuardService} from '@shared/services';
import {NotificationsComponent} from './notifications.component';

const routes: Routes = [
  {
    path: '',
    data: {id: 'module.develop.notifications', action: 'view'},
    canActivate: [PrivatePageGuardService],
    component: NotificationsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    NotificationsComponent
  ],
  exports: [
    RouterModule
  ]
})
export class NotificationsModule {}
