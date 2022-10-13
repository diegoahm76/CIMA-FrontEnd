import {Injectable} from '@angular/core';

import {NGXLogger} from 'ngx-logger';

import {ApiService, AppService, PermissionsService} from '@shared/services';
import {DevelopUsersUtil} from '../utils';

@Injectable()
export class DevelopUsersService {
  private readonly instances: {[key: string]: DevelopUsersUtil};

  constructor(
    private appService: AppService,
    private permissionsService: PermissionsService,
    private apiService: ApiService,
    private logger: NGXLogger
  ) {
    this.instances = {};
  }

  getInstance(key: string): DevelopUsersUtil {
    if (!this.instances[key]) {
      this.instances[key] = new DevelopUsersUtil({
        appService: this.appService,
        permissionsService: this.permissionsService,
        apiService: this.apiService,
        logger: this.logger,
      });
    }
    return this.instances[key];
  }
}
