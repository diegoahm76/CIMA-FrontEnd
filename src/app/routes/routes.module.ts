import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MenuService} from '../core/menu/menu.service';

import {menu} from './menu';
import {routes} from './routes';

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  declarations: [],
  exports: [RouterModule],
})
export class RoutesModule {
  constructor(menuService: MenuService) {
    menuService.addMenu(menu);
  }
}
