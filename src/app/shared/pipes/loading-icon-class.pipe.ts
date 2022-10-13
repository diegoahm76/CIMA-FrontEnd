import {Pipe, PipeTransform} from '@angular/core';

import {StoreStatus} from '@shared/enums';

@Pipe({
  name: 'loadingIconClass',
})
export class LoadingIconClassPipe implements PipeTransform {
  transform(
    status: StoreStatus,
    iconClass: string,
    spinClass: string = 'fas fa-spinner fa-spin'
  ): string {
    if (status === StoreStatus.LOADING) {
      return spinClass;
    }
    return iconClass;
  }
}
