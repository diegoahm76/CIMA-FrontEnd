import {Component, Input, Output, EventEmitter} from '@angular/core';

import {NGXLogger} from 'ngx-logger';

import {DevelopUsersState} from '@app/routes/shared/utils';
import {StoreStatus} from '@shared/enums';
import {DevelopUserModel} from '@app/routes/shared/models';

@Component({
  selector: 'app-user-list-ui',
  templateUrl: './user-list.component.html',
})
export class UserListComponent {
  @Input()
  state: DevelopUsersState;
  @Output()
  editInModalClick: EventEmitter<DevelopUserModel>;
  @Output()
  editClick: EventEmitter<DevelopUserModel>;
  @Output()
  deleteClick: EventEmitter<DevelopUserModel>;
  @Output()
  modelUpdated: EventEmitter<{
    model: DevelopUserModel;
    oldModel: DevelopUserModel;
  }>;

  storeStatus = StoreStatus;

  constructor(private logger: NGXLogger) {
    this.editInModalClick = new EventEmitter<DevelopUserModel>();
    this.editClick = new EventEmitter<DevelopUserModel>();
    this.deleteClick = new EventEmitter<DevelopUserModel>();
    this.modelUpdated = new EventEmitter<{
      model: DevelopUserModel;
      oldModel: DevelopUserModel;
    }>();
  }

  identify(index: number, item: DevelopUserModel): number {
    return item.id;
  }
}
