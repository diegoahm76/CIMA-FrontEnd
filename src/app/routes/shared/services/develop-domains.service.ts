import {Injectable} from '@angular/core';

import {NGXLogger} from 'ngx-logger';

import {ApiService, AppService, PermissionsService} from '@shared/services';
import {DevelopDomainsUtil} from '@app/routes/shared/utils';

@Injectable()
export class DevelopDomainsService {
  private readonly instances: {[key: string]: DevelopDomainsUtil};

  constructor(
    private appService: AppService,
    private permissionsService: PermissionsService,
    private apiService: ApiService,
    private logger: NGXLogger
  ) {
    this.instances = {};
  }

  getInstance(key: string): DevelopDomainsUtil {
    if (!this.instances[key]) {
      this.instances[key] = new DevelopDomainsUtil({
        appService: this.appService,
        permissionsService: this.permissionsService,
        apiService: this.apiService,
        logger: this.logger,
      });
    }
    return this.instances[key];
  }
}
