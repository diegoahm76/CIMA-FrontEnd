import {PermissionsUtil} from '@shared/utils';

export class Model {
  id: number;
  _permissions?: PermissionsUtil;

  get strId(): string {
    return String(this.id);
  }
}
