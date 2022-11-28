import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {PrivatePageGuardService} from '@app/shared/services';
import {ImpactComponent} from './impact.component';

const routes: Routes = [
  {
    path: '',
    data: {id: 'module.modules.government-priorities.impact', action: 'view'},
    canActivate: [PrivatePageGuardService],
    component: ImpactComponent,
  },
];

@NgModule({
  declarations: [ImpactComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImpactModule {}
