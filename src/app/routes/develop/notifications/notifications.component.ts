import {Component} from '@angular/core';

import {ToastrService} from 'ngx-toastr';

@Component({
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent {
  constructor(private toastr: ToastrService) {}

  showInfo() {
    this.toastr.info('Just some information for you.');
  }

  showSuccess() {
    this.toastr.success('You are awesome!', 'Success!');
  }

  showWarning() {
    this.toastr.warning('You are being warned.', 'Alert!');
  }

  showError() {
    this.toastr.error('This is not good!', 'Oops!');
  }

  // @TODO: deprecated
  // showCustom(){
  //   this.toastr.custom('<span style="color: red">Message in red.</span>', null, {enableHTML: true});
  // }
}
