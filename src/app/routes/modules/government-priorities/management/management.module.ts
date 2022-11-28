import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {PrivatePageGuardService} from '@app/shared/services';
import {MmamaTressComponent} from './mmama-tress/mmama-tress.component';
import {ClimateChangeManagementComponent} from './climate-change-management/climate-change-management.component';
import {TopicsComponent} from './topics/topics.component';

const routes: Routes = [
  {
    path: 'topics',
    data: {
      id: 'module.modules.government-priorities.management.topics',
      action: 'view',
    },
    canActivate: [PrivatePageGuardService],
    component: TopicsComponent,
  },
  {
    path: 'tress',
    data: {
      id: 'module.modules.government-priorities.management.mmama-tress',
      action: 'view',
    },
    canActivate: [PrivatePageGuardService],
    component: MmamaTressComponent,
  },
  {
    path: 'climateChangeManagement',
    data: {
      id: 'module.modules.government-priorities.management.climate-change-management',
      action: 'view',
    },
    canActivate: [PrivatePageGuardService],
    component: ClimateChangeManagementComponent,
  },
];

@NgModule({
  declarations: [MmamaTressComponent, ClimateChangeManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementModule {}
