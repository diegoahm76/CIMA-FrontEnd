import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopicsComponent} from './topics/topics.component';
import {BiodiversityComponent} from './biodiversity/biodiversity.component';
import {RouterModule, Routes} from '@angular/router';
import {PrivatePageGuardService} from '@app/shared/services';

const routes: Routes = [
  {
    path: 'topics',
    data: {
      id: 'module.modules.performance-and-management.management.topics',
      action: 'view',
    },
    canActivate: [PrivatePageGuardService],
    component: TopicsComponent,
  },
  {
    path: 'BIODIVERSITY',
    data: {
      id: 'module.modules.performance-and-management.management.biodiversity',
      action: 'view',
    },
    canActivate: [PrivatePageGuardService],
    component: BiodiversityComponent,
  },
];

@NgModule({
  declarations: [TopicsComponent, BiodiversityComponent],
  imports: [RouterModule.forChild(routes), CommonModule],
})
export class ManagementModule {}
