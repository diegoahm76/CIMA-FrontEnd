import {Injectable} from '@angular/core';

import {NGXLogger} from 'ngx-logger';

import {ApiService} from '@shared/services';
import {TreeUtil} from '../utils';

@Injectable()
export class TreeService {
  private readonly instances: {[key: string]: TreeUtil};

  constructor(private apiService: ApiService, private logger: NGXLogger) {
    this.instances = {};
  }

  getInstance(key: string) {
    if (!this.instances[key]) {
      this.instances[key] = new TreeUtil({
        apiService: this.apiService,
        logger: this.logger,
      });
    }
    return this.instances[key];
  }
}
