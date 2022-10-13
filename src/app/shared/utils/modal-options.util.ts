import {ModalOptions as NgxModalOptions} from 'ngx-bootstrap/modal';

export class ModalOptions {
  modal: string;
  config: NgxModalOptions;

  constructor() {
    // Configuracion por defecto
    this.config = {
      show: false,
      ignoreBackdropClick: true,
      keyboard: true,
    };
  }
}
