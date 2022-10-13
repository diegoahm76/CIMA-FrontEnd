import {Pipe, PipeTransform} from '@angular/core';

import {NgOption} from '@ng-select/ng-select';

@Pipe({
  name: 'ngOption',
})
export class NgOptionPipe implements PipeTransform {
  transform(value: {[prop: string]: any}[], idProp: string, labelProp): any[] {
    if (!(value instanceof Array)) {
      return [];
    }
    return value.map((model: any) => {
      return {value: model[idProp], label: model[labelProp]} as NgOption;
    });
  }
}
