import * as _ from 'lodash';

import {PermissionsService} from '@shared/services';
import {Conditions, ResourceOptions} from '@shared/interfaces';

export class PermissionsUtil {
  private readonly permissionsService: PermissionsService;
  private readonly modelOptions: {[tempProp: string]: any};
  private readonly roles: string | string[] | undefined;

  abilities: {[ability: string]: boolean};

  constructor(
    permissionsService: PermissionsService,
    modelOptions: {[tempProp: string]: any} = {},
    roles?: string | string[]
  ) {
    this.permissionsService = permissionsService;
    this.modelOptions = modelOptions;
    this.roles = roles;

    this.abilities = {};

    if (roles !== undefined) {
      if (!(roles instanceof Array)) {
        roles = [roles as string];
      }

      let abilities: string[] = [];
      let roleAbilities;
      for (const role of roles) {
        roleAbilities = this.permissionsService.getRoleAbilities(role);
        if (roleAbilities.length) {
          abilities = [...abilities, ...roleAbilities];
        }
      }
      abilities = _.uniq(abilities);
      for (const ability of abilities) {
        this.abilities[ability] = this.isAllowed(ability);
      }
    }
  }

  isAllowed(ability: string, roles?: string | string[]) {
    if (!roles) {
      roles = this.roles;
    }
    if (!roles) {
      return false;
    }
    if (!(roles instanceof Array)) {
      roles = [roles as string];
    }

    let resourceOptions: ResourceOptions | void;
    let tmp: boolean;
    for (const role of roles) {
      if (!this.permissionsService.isRoleDefined(role)) {
        console.warn(`no estan definidos los permisos para el role "${role}"`);
        continue;
      }
      resourceOptions = this.permissionsService.getResourceOptions(
        role,
        ability
      );
      if (!resourceOptions) {
        continue;
      }

      tmp = this.checkAbility(resourceOptions.conditions);
      if (tmp) {
        return true;
      }
    }
    return false;
  }

  private checkAbility(conditions?: Conditions) {
    let isAllowed = true;
    if (conditions !== undefined) {
      let value: any;
      for (const prop in conditions) {
        if (!conditions.hasOwnProperty(prop)) {
          continue;
        }

        value = conditions[prop];
        if (value === '*') {
          continue;
        }
        if (value instanceof Array) {
          if (value.includes(this.modelOptions[prop])) {
            isAllowed = false;
            break;
          }
        } else if (typeof value === 'string') {
          if (!_.startsWith(value, '!')) {
            if (value !== this.modelOptions[prop]) {
              isAllowed = false;
              break;
            }
          } else {
            value = value.substring(1);
            if (value === this.modelOptions[prop]) {
              isAllowed = false;
              break;
            }
          }
        } else if (typeof value === 'boolean') {
          if (value !== this.modelOptions[prop]) {
            isAllowed = false;
            break;
          }
        }
      }
    }
    return isAllowed;
  }
}
