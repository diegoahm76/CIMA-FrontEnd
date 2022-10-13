import {Component, EventEmitter, Input, Output} from '@angular/core';

import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-activation-switch',
  templateUrl: './activation-switch.component.html'
})
export class ActivationSwitchComponent {
  @Input()
  checked: boolean;
  @Input()
  tooltipStr?: string;
  @Output()
  changeStatusClick: EventEmitter<{
    checked: boolean;
    event: any;
  }>;

  constructor(
    private logger: NGXLogger
  ) {
    this.changeStatusClick = new EventEmitter<{
      checked: boolean;
      event: any;
    }>();
  }
}
