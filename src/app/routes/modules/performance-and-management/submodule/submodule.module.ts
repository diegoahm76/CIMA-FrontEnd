import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SubmoduleComponent} from './submodule.component';
import {PrivatePageGuardService} from '@app/shared/services';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      id: 'module.modules.performance-and-management.submenu',
      action: 'view',
    },
    canActivate: [PrivatePageGuardService],
    component: SubmoduleComponent,
  },
];

@NgModule({
  declarations: [SubmoduleComponent],
  imports: [RouterModule.forChild(routes), CommonModule],
})
export class SubmoduleModule {}
