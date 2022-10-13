import {Injectable} from '@angular/core';

import {NGXLogger} from 'ngx-logger';

import {StaticSelectOptionsUtil} from '../utils';

@Injectable()
export class StaticSelectOptionsService {
  private readonly instances: {[key: string]: StaticSelectOptionsUtil};

  constructor(private logger: NGXLogger) {
    this.instances = {};
  }

  getInstance(key: string) {
    if (!this.instances[key]) {
      this.instances[key] = new StaticSelectOptionsUtil({
        logger: this.logger,
      });
    }
    return this.instances[key];
  }
}
