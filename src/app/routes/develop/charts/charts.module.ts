import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';

import {BasicComponentsModule} from '@shared/basic-components/basic-components.module';
import {ComponentsModule} from '@shared/components/components.module';
import {PrivatePageGuardService} from '@shared/services';
import {ChartsService} from './shared/services';
import {ChartsComponent} from './shared/components/charts';
import {ChartsContainerComponent} from './charts-container';

const routes: Routes = [
  {
    path: '',
    data: {id: 'module.develop.charts', action: 'view'},
    canActivate: [PrivatePageGuardService],
    component: ChartsContainerComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    BasicComponentsModule,
    ComponentsModule,
    // PipesModule
  ],
  declarations: [ChartsContainerComponent, ChartsComponent],
  exports: [RouterModule],
  providers: [ChartsService],
})
export class ChartsModule {}
