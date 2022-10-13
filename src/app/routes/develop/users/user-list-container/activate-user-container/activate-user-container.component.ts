import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Params} from '@angular/router';
import {map} from 'rxjs/operators';

import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';

import {ApiService} from '@shared/services';
import {ApplicationError} from '@shared/utils';
import {DevelopUserStatusEnum} from '@app/routes/shared/enums';
import {DevelopUserModel} from '@app/routes/shared/models';

@Component({
  selector: 'app-activate-user',
  templateUrl: './activate-user-container.component.html',
})
export class ActivateUserContainerComponent {
  @Input()
  user: DevelopUserModel;
  @Input()
  tooltipStr?: string;
  @Output()
  modelUpdated: EventEmitter<DevelopUserModel>;

  userStatusEnum = DevelopUserStatusEnum;

  constructor(
    private toastr: ToastrService,
    private apiService: ApiService,
    private logger: NGXLogger
  ) {
    this.modelUpdated = new EventEmitter<DevelopUserModel>();
  }

  changeEstado({checked, event}: {checked: boolean; event: any}) {
    const data: Params = {
      id: this.user.id,
      status: checked
        ? DevelopUserStatusEnum.ACTIVE
        : DevelopUserStatusEnum.INACTIVE,
    };

    this.apiService
      .save('users', data, ['status'])
      .pipe(
        map((res: {[prop: string]: any}) => DevelopUserModel.getInstance(res))
      )
      .subscribe(
        (updatedModel: DevelopUserModel) => {
          this.modelUpdated.emit(updatedModel);

          // Notificacion
          const action = checked ? 'activó' : 'desactivó';
          this.toastr.success(
            `El usuario "${this.user.email}" se ${action} correctamente`,
            'Información!'
          );
        },
        (error: ApplicationError | any) => {
          setTimeout(() => {
            if (event !== undefined) {
              event.target.checked = !checked;
            }
          }, 200);

          // Notificacion
          const action = checked ? 'activar' : 'desactivar';
          this.toastr.error(
            `No se pudo ${action} el usuario "${this.user.email}"`,
            'Oops!'
          );
        }
      );
  }
}
