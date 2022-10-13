import {
  Component,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import {Params} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';

import {SubmitService, SubmitState} from '../../shared/services';
import {StoreStatus} from '@shared/enums';
import {DevelopDomainModel} from '@app/routes/shared/models';

@Component({
  selector: 'app-domain-form-modal',
  templateUrl: './domain-form-modal-container.component.html',
})
export class DomainFormModalContainerComponent implements OnInit, OnDestroy {
  @Input()
  parentModel: DevelopDomainModel;
  @Input()
  domain?: DevelopDomainModel;
  @Input()
  type: string;
  @Output()
  closeClick: EventEmitter<void>;
  @Output()
  modelCreated: EventEmitter<DevelopDomainModel>;
  @Output()
  modelUpdated: EventEmitter<{
    model: DevelopDomainModel;
    oldModel: DevelopDomainModel;
  }>;

  private unsubscribe = new Subject<void>();

  state$: Observable<SubmitState>;

  constructor(
    private toastr: ToastrService,
    private submitService: SubmitService,
    private logger: NGXLogger
  ) {
    this.closeClick = new EventEmitter<void>();
    this.modelCreated = new EventEmitter<DevelopDomainModel>();
    this.modelUpdated = new EventEmitter<{
      model: DevelopDomainModel;
      oldModel: DevelopDomainModel;
    }>();
  }

  ngOnInit() {
    this.initServices();
    this.initSubscriptions();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private initServices() {
    this.state$ = this.submitService.getState();
    this.submitService.next({
      status: StoreStatus.INITIATED,
    });
  }

  private initSubscriptions() {
    this.state$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((state: SubmitState) => {
        if (state.status === StoreStatus.OK) {
          if (!state.oldModel) {
            // Notificacion
            this.toastr.success(
              `El registro de dominio controlado "${state.model.value}" se creó correctamente`,
              'Información!'
            );

            this.modelCreated.emit(state.model);
          } else {
            // Notificacion
            this.toastr.success(
              `El registro de dominio controlado "${state.oldModel.value}" se editó correctamente`,
              'Información!'
            );

            this.modelUpdated.emit({
              model: state.model,
              oldModel: state.oldModel,
            });
          }
          this.closeClick.emit();
        }
      });
  }

  submit(data: Params) {
    if (!this.domain) {
      data.parentId = this.parentModel.id;
      data.type = this.type;
    } else {
      data.id = this.domain.id;
    }
    this.submitService.next({
      data,
      oldModel: this.domain,
    });
  }
}
