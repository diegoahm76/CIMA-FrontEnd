import {OnChanges, Input, SimpleChanges, Component} from '@angular/core';

import {NGXLogger} from 'ngx-logger';

import {
  DevelopDomainStatusEnum,
  DevelopDomainStatusValues,
} from '@app/routes/shared/enums';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
})
export class StatusBadgeComponent implements OnChanges {
  @Input()
  status: string;

  badgeClass: string;

  domainStatusValues = DevelopDomainStatusValues;

  constructor(private logger: NGXLogger) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.status.currentValue !== changes.status.previousValue) {
      this.badgeClass = this.getStatusClass(changes.status.currentValue);
    }
  }

  getStatusClass(status: string) {
    let statusClass: string;
    if (status === DevelopDomainStatusEnum.ACTIVE) {
      statusClass = 'badge-success';
    } else if (status === DevelopDomainStatusEnum.INACTIVE) {
      statusClass = 'badge-dark';
    }
    return statusClass;
  }
}
