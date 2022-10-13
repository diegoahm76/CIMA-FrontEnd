import {Injectable} from '@angular/core';

import {NGXLogger} from 'ngx-logger';

import {ApiService, AppService, PermissionsService} from '@shared/services';
import {ChartsUtil} from '../utils';

@Injectable()
export class ChartsService {
  private readonly instances: {[key: string]: ChartsUtil};

  constructor(
    private appService: AppService,
    private permissionsService: PermissionsService,
    private apiService: ApiService,
    private logger: NGXLogger
  ) {
    this.instances = {};
  }

  getInstance(key: string): ChartsUtil {
    if (!this.instances[key]) {
      this.instances[key] = new ChartsUtil({
        appService: this.appService,
        permissionsService: this.permissionsService,
        apiService: this.apiService,
        logger: this.logger,
      });
    }
    return this.instances[key];
  }
}
