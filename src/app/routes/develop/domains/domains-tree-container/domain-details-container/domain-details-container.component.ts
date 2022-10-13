import {Component, Output, EventEmitter, Input} from '@angular/core';

import {NGXLogger} from 'ngx-logger';

import {DevelopDomainModel} from '@app/routes/shared/models';

@Component({
  selector: 'app-domain-details',
  templateUrl: './domain-details-container.component.html',
})
export class DomainDetailsContainerComponent {
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

  constructor(private logger: NGXLogger) {
    this.editClick = new EventEmitter<void>();
    this.deleteClick = new EventEmitter<void>();
    this.modelUpdated = new EventEmitter<{
      model: DevelopDomainModel;
      oldModel: DevelopDomainModel;
    }>();
  }
}
