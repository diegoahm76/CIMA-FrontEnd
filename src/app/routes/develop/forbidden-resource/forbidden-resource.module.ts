import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {PrivatePageGuardService} from '@shared/services';
import {ForbiddenResourceComponent} from './forbidden-resource';

const routes: Routes = [
  {
    path: '',
    data: {id: 'module.develop.forbiddenResource', action: 'view'},
    canActivate: [PrivatePageGuardService],
    component: ForbiddenResourceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: [ForbiddenResourceComponent],
  exports: [RouterModule],
})
export class ForbiddenResourceModule {}
