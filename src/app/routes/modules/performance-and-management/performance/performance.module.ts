import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopicsComponent} from './topics/topics.component';
import {FSINAComponent} from './fsina/fsina.component';
import {IEDIComponent} from './iedi/iedi.component';
import {PrivatePageGuardService} from '@app/shared/services';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'topics',
    data: {
      id: 'module.modules.performance-and-management.performance.topics',
      action: 'view',
    },
    canActivate: [PrivatePageGuardService],
    component: TopicsComponent,
  },
  {
    path: 'IEDI',
    data: {
      id: 'module.modules.performance-and-management.performance.iedi',
      action: 'view',
    },
    canActivate: [PrivatePageGuardService],
    component: IEDIComponent,
  },
  {
    path: 'FSINA',
    data: {
      id: 'module.modules.performance-and-management.performance.fsina',
      action: 'view',
    },
    canActivate: [PrivatePageGuardService],
    component: FSINAComponent,
  },
];
@NgModule({
  declarations: [TopicsComponent, FSINAComponent, IEDIComponent],
  imports: [RouterModule.forChild(routes), CommonModule],
})
export class PerformanceModule {}
