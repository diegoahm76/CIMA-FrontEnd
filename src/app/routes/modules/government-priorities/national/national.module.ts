import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {NationalComponent} from './national.component';
import {PrivatePageGuardService} from '@app/shared/services';

const routes: Routes = [
  {
    path: '',
    data: {id: 'module.modules.government-priorities.national', action: 'view'},
    canActivate: [PrivatePageGuardService],
    component: NationalComponent,
  },
];

@NgModule({
  declarations: [NationalComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NationalModule {}
