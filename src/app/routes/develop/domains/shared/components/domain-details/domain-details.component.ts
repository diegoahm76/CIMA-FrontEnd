import {Component, Output, EventEmitter, Input} from '@angular/core';

import {NGXLogger} from 'ngx-logger';

import {DevelopDomainTypeValues} from '@app/routes/shared/enums';
import {DevelopDomainModel} from '@app/routes/shared/models';

@Component({
  selector: 'app-domain-details-ui',
  templateUrl: './domain-details.component.html',
  styleUrls: ['./domain-details.component.scss'],
})
export class DomainDetailsComponent {
  @Input()
  type: string;
  @Input()
  domain: DevelopDomainModel;
  @Output()
  editClick: EventEmitter<void>;
  @Output()
  deleteClick: EventEmitter<void>;
  @Output()
  modelUpdated: EventEmitter<{
    model: DevelopDomainModel;
    oldModel: DevelopDomainModel;
  }>;

  domainTypeValues = DevelopDomainTypeValues;

  constructor(private logger: NGXLogger) {
    this.editClick = new EventEmitter<void>();
    this.deleteClick = new EventEmitter<void>();
    this.modelUpdated = new EventEmitter<{
      model: DevelopDomainModel;
      oldModel: DevelopDomainModel;
    }>();
  }
}
