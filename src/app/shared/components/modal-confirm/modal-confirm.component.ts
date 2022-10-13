import {Component, Input, Output, EventEmitter} from '@angular/core';

import {ButtonLabelUtil} from '@shared/utils';
import {StoreStatus} from '@shared/enums';

@Component({
  selector: 'app-modal-confirm-ui',
  templateUrl: './modal-confirm.component.html',
})
export class ModalConfirmComponent{
  @Input() title = 'modal.titles.confirmation';
  @Input() status: StoreStatus;
  @Input() submitButton: ButtonLabelUtil;
  @Input() cancelButton = 'buttons.cancel.cerrar';
  @Output() closeClick: EventEmitter<void>;
  @Output() confirmClick: EventEmitter<void>;

  storeStatus = StoreStatus;

  constructor() {
    this.closeClick = new EventEmitter<void>();
    this.confirmClick = new EventEmitter<void>();
  }
}
