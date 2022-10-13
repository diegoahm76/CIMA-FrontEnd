import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {PrivatePageGuardService} from '@shared/services';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  {
    path: '',
    data: {id: 'module.home', action: 'view'},
    canActivate: [PrivatePageGuardService],
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: [HomeComponent],
  exports: [RouterModule]
})
export class HomeModule {}
