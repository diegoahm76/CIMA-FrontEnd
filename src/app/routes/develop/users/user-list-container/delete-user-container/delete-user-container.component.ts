import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';

import {DeleteUserService, DeleteUserState} from '../../shared/services';
import {ButtonLabelUtil} from '@shared/utils';
import {StoreStatus} from '@shared/enums';
import {
  DevelopUserRoleValues,
  DevelopUserStatusValues,
} from '@app/routes/shared/enums';
import {DevelopUserModel} from '@app/routes/shared/models';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user-container.component.html',
})
export class DeleteUserContainerComponent implements OnDestroy, OnInit {
  @Input()
  user: DevelopUserModel;
  @Output()
  closeClick: EventEmitter<void>;
  @Output()
  modelDeleted: EventEmitter<void>;

  private unsubscribe = new Subject<void>();

  state$: Observable<DeleteUserState>;
  submitButton: ButtonLabelUtil;

  storeStatus = StoreStatus;
  userRoleValues = DevelopUserRoleValues;
  userStatusValues = DevelopUserStatusValues;

  constructor(
    private datePipe: DatePipe,
    private translate: TranslateService,
    private toastr: ToastrService,
    private deleteService: DeleteUserService,
    private logger: NGXLogger
  ) {
    this.closeClick = new EventEmitter<void>();
    this.modelDeleted = new EventEmitter<void>();
  }

  ngOnInit() {
    this.initButtonLabels();
    this.initServices();
    this.initSubscriptions();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private initButtonLabels() {
    this.submitButton = new ButtonLabelUtil(
      this.translate.get('buttons.delete.borrar'),
      this.translate.get('buttons.delete.borrando')
    );
  }

  private initServices() {
    this.state$ = this.deleteService.getState();
    this.deleteService.next({
      status: StoreStatus.INITIATED,
    });
  }

  private initSubscriptions() {
    this.state$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((state: DeleteUserState) => {
        if (state.status === StoreStatus.LOADING) {
          this.submitButton.loadingLabel();
        } else if (state.status === StoreStatus.OK) {
          // Notificacion
          this.toastr.success(
            `El usuario "${this.user.email}" se borró correctamente`,
            'Información!'
          );

          this.modelDeleted.emit();
          this.closeClick.emit();
        } else if (state.status === StoreStatus.ERROR) {
          this.submitButton.defaultLabel();
        }
      });
  }

  confirm() {
    this.deleteService.next({
      model: this.user,
    });
  }
}
