import {OnChanges, Input, SimpleChanges, Component} from '@angular/core';

import {NGXLogger} from 'ngx-logger';

import {
  DevelopUserStatusEnum,
  DevelopUserStatusValues,
} from '@app/routes/shared/enums';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
})
export class StatusBadgeComponent implements OnChanges {
  @Input()
  status: string;

  badgeClass: string;

  userStatusValues = DevelopUserStatusValues;

  constructor(private logger: NGXLogger) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.status.currentValue !== changes.status.previousValue) {
      this.badgeClass = this.getStatusClass(changes.status.currentValue);
    }
  }

  getStatusClass(status: string): string {
    let statusClass: string;
    if (status === DevelopUserStatusEnum.NEW) {
      statusClass = 'badge-dark';
    } else if (status === DevelopUserStatusEnum.ACTIVE) {
      statusClass = 'badge-success';
    } else if (status === DevelopUserStatusEnum.INACTIVE) {
      statusClass = 'badge-warning';
    }
    return statusClass;
  }
}
