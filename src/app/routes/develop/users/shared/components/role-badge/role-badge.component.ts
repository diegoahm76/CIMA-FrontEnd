import {OnChanges, Input, SimpleChanges, Component} from '@angular/core';

import {NGXLogger} from 'ngx-logger';

import {
  DevelopUserRoleEnum,
  DevelopUserRoleValues,
} from '@app/routes/shared/enums';

@Component({
  selector: 'app-role-badge',
  templateUrl: './role-badge.component.html',
})
export class RoleBadgeComponent implements OnChanges {
  @Input()
  role: string;

  badgeClass: string;

  userRoleValues = DevelopUserRoleValues;

  constructor(private logger: NGXLogger) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.role.currentValue !== changes.role.previousValue) {
      this.badgeClass = this.getRoleClass(changes.role.currentValue);
    }
  }

  getRoleClass(role: string): string {
    let roleClass: string;
    if (role === DevelopUserRoleEnum.ADMIN) {
      roleClass = 'badge-dark';
    } else if (role === DevelopUserRoleEnum.USER) {
      roleClass = 'badge-info';
    }
    return roleClass;
  }
}
