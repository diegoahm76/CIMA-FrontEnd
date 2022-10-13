import {Injectable} from '@angular/core';

import {NGXLogger} from 'ngx-logger';

import {AppService, PermissionsService} from '@shared/services';
import {PermissionsUtil} from '@shared/utils';

@Injectable()
export class MenuService {
  menuItems: Array<any>;
  permissionsUtil: PermissionsUtil;

  constructor(
    private appService: AppService,
    private permissionsService: PermissionsService,
    private logger: NGXLogger
  ) {
    this.menuItems = [];
  }

  addMenu(
    items: Array<{
      text: string;
      heading?: boolean;
      link?: string; // internal route links
      elink?: string; // used only for external links
      target?: string; // anchor target="_blank|_self|_parent|_top|framename"
      icon?: string;
      alert?: string;
      submenu?: Array<any>;
      id?: string;
    }>
  ) {
    const user = this.appService.currentUser;
    const userRole = user ? user._role : 'public';

    this.permissionsUtil = new PermissionsUtil(
      this.permissionsService,
      {},
      userRole
    );

    this.logger.info('MenuService abilities', this.permissionsUtil.abilities);

    const filterItems = (item: any) => {
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
    this.logger.info('menuItems', this.menuItems);
  }

  getMenu() {
    return this.menuItems;
  }
}
