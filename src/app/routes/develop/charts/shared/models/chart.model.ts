import {PropsMapping} from '@shared/interfaces';
import {Model} from '@shared/models';

const propsMapping: PropsMapping = {
  id: 'chartId',
  categories: 'categories',
  series: 'series'
};

export class Chart extends Model {
  categories: string[];
  series: {
    name: string,
    data: number[]
  };

  static getInstance(data: {[prop: string]: any}): Chart {
    const model = new Chart();
    for (const prop in propsMapping) {
      if (!propsMapping.hasOwnProperty(prop)) {
        continue;
      }
      if (
        data[propsMapping[prop]] === undefined ||
        data[propsMapping[prop]] === null
      ) {
        continue;
      }

      model[prop] = data[propsMapping[prop]];
    }
    return model;
  }
}
