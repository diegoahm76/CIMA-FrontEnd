import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SubmenuComponent} from './submenu.component';
import {PrivatePageGuardService} from '@app/shared/services';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {id: 'module.submenu', action: 'view'},
    canActivate: [PrivatePageGuardService],
    component: SubmenuComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class SubmenuModule {}
