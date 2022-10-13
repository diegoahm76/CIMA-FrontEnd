import {Injectable} from '@angular/core';

import {NGXLogger} from 'ngx-logger';

import {AppService} from './app.service';
import {PermissionsService} from './permissions.service';
import {PermissionsUtil} from '@shared/utils';
import {MenuItem} from '@shared/interfaces';

@Injectable()
export class MenuService {
  menuItems: MenuItem[];
  permissionsUtil: PermissionsUtil;

  constructor(
    private appService: AppService,
    private permissionsService: PermissionsService,
    private logger: NGXLogger
  ) {
    this.menuItems = [];
  }

  getMenu(): MenuItem[] {
    return this.menuItems;
  }

  setMenu(items: MenuItem[]) {
    const user = this.appService.currentUser;
    const userRole = user ? user._role : 'public';

    this.permissionsUtil = new PermissionsUtil(
      this.permissionsService,
      {},
      userRole
    );

    console.info('MenuService abilities', this.permissionsUtil.abilities);

    const filterItems = (item: MenuItem) => {
      if (!item.id) {
        return false;
      }
      const result = this.permissionsUtil.abilities[`${item.id}.view`];
      if (!result) {
        return false;
      }
      // @TODO: eduardo: probar este pedazo
      if (Array.isArray(item.items) && item.items.length) {
        item.items = item.items.filter(filterItems);
      }
      return true;
    };

    this.menuItems = items.filter(filterItems);

    console.info('MenuService menuItems', this.menuItems);
  }
}
