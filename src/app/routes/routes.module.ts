import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MenuService} from '../core/menu/menu.service';

import {menu} from './menu';
import {routes} from './routes';
import {ImpactComponent} from './modules/performance-and-management/government-priorities/impact/impact/impact.component';
import {ManagementComponent} from './modules/performance-and-management/government-priorities/management/management/management.component';
import {NationalComponent} from './modules/performance-and-management/government-priorities/national/national/national.component';
import {SubmoduleComponent} from './submodule/submodule.component';

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  declarations: [
    SubmoduleComponent,
    ImpactComponent,
    ManagementComponent,
    NationalComponent,
  ],
  exports: [RouterModule],
})
export class RoutesModule {
  constructor(menuService: MenuService) {
    menuService.addMenu(menu);
  }
}
