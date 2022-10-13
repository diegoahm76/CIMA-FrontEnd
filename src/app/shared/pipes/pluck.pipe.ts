import {Pipe, PipeTransform} from '@angular/core';
import {Params} from '@angular/router';

import * as _ from 'lodash';

@Pipe({
  name: 'pluck',
})
export class PluckPipe implements PipeTransform {
  transform(value: Params[], key: string): any[] {
    if (!(value instanceof Array)) {
      return value;
    }
    return _.map(value, key);
  }
}
