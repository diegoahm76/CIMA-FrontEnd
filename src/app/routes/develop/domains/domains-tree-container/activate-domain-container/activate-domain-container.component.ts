import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Params} from '@angular/router';
import {map} from 'rxjs/operators';

import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';

import {ApiService} from '@shared/services';
import {ApplicationError} from '@shared/utils';
import {DevelopDomainStatusEnum} from '@app/routes/shared/enums';
import {DevelopDomainModel} from '@app/routes/shared/models';

@Component({
  selector: 'app-activate-domain',
  templateUrl: './activate-domain-container.component.html',
})
export class ActivateDomainContainerComponent {
  @Input()
  domain: DevelopDomainModel;
  @Input()
  tooltipStr?: string;
  @Output()
  modelUpdated: EventEmitter<DevelopDomainModel>;

  domainStatusEnum = DevelopDomainStatusEnum;

  constructor(
    private toastr: ToastrService,
    private apiService: ApiService,
    private logger: NGXLogger
  ) {
    this.modelUpdated = new EventEmitter<DevelopDomainModel>();
  }

  changeEstado({checked, event}: {checked: boolean; event: any}) {
    const data: Params = {
      id: this.domain.id,
      status: checked
        ? DevelopDomainStatusEnum.ACTIVE
        : DevelopDomainStatusEnum.INACTIVE,
    };

    this.apiService
      .save('domains', data, ['status'])
      .pipe(
        map((res: {[prop: string]: any}) => DevelopDomainModel.getInstance(res))
      )
      .subscribe(
        (updatedModel: DevelopDomainModel) => {
          this.modelUpdated.emit(updatedModel);

          // Notificacion
          const action = checked ? 'activó' : 'desactivó';
          this.toastr.success(
            `El registro de dominio controlado "${this.domain.value}" se ${action} correctamente`,
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
            `No se pudo ${action} el registro de dominio controlado "${this.domain.value}"`,
            'Oops!'
          );
        }
      );
  }
}
