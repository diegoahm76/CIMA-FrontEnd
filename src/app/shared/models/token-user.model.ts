import {PropsMapping} from '@shared/interfaces';
import {Model} from './model';

const propsMapping: PropsMapping = {
  id: 'usuarioId',
  nombres: 'nombres',
  apellidos: 'apellidos',
  email: 'email',
  rol: 'rol'
};

export class TokenUserModel extends Model {
  nombres: string;
  apellidos: string;
  email: string;
  rol: string;

  get _role(): string {
    return this.rol;
  }

  static getInstance(data: {[prop: string]: any}): TokenUserModel {
    const model = new TokenUserModel();
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
