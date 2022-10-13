import {Injectable} from '@angular/core';

import {permissions} from '@app/routes/permissions';
import {Permissions, ResourceOptions} from '@shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private readonly permissions: Permissions;

  constructor() {
    this.permissions = permissions;
  }

  getRoleAbilities(role: string): string[] {
    let abilities: string[] = [];
    let tmp: string[];
    if (this.permissions[role]) {
      for (const resource in this.permissions[role]) {
        if (!this.permissions[role].hasOwnProperty(resource)) {
          continue;
        }
        tmp = this.permissions[role][resource].map(
          (resourceOptions: ResourceOptions) => {
            return `${resource}.${resourceOptions.action}`;
          }
        );
        abilities = [...abilities, ...tmp];
      }
    }
    return abilities;
  }

  getResourceOptions(role: string, ability: string): ResourceOptions | void {
    // Extrae la ultima parte del ability
    const parts = ability.split('.');
    const action = parts.splice(parts.length - 1, 1);
    const resourcesOptions = this.permissions[role][parts.join('.')];
    if (resourcesOptions) {
      return resourcesOptions.find((resourceOptions: ResourceOptions) => {
        return resourceOptions.action === action[0];
      });
    }
  }

  isRoleDefined(role: string) {
    return this.permissions[role] !== undefined;
  }
}
