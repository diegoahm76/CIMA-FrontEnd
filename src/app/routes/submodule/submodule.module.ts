import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SubmoduleComponent} from './submodule.component';
import {PrivatePageGuardService} from '@app/shared/services';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {id: 'module.submenu', action: 'view'},
    canActivate: [PrivatePageGuardService],
    component: SubmoduleComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class SubmoduleModule {}