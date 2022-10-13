import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {Params} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {NGXLogger} from 'ngx-logger';

import {DevelopDomainsService} from '@app/routes/shared/services';
import {SubmitUserService, SubmitUserState} from '../../shared/services';
import {StaticSelectOptionsState} from '@shared/utils';
import {DevelopDomainsState} from '@app/routes/shared/utils';
import {StoreStatus} from '@shared/enums';
import {DevelopDomainStatusEnum} from '@app/routes/shared/enums';
import {DevelopUserModel} from '@app/routes/shared/models';

@Component({
  selector: 'app-user-form-modal',
  templateUrl: './user-form-modal-container.component.html',
})
export class UserFormModalContainerComponent implements OnDestroy, OnInit {
  @Input()
  user?: DevelopUserModel;
  @Input()
  statesState$: Observable<DevelopDomainsState>;
  @Input()
  citiesState$: Observable<DevelopDomainsState>;
  @Input()
  rolesState$: Observable<StaticSelectOptionsState>;
  @Output()
  closeClick: EventEmitter<void>;
  @Output()
  modelCreated: EventEmitter<DevelopUserModel>;
  @Output()
  modelUpdated: EventEmitter<{
    model: DevelopUserModel;
    oldModel: DevelopUserModel;
  }>;

  private unsubscribe = new Subject<void>();

  state$: Observable<SubmitUserState>;

  constructor(
    private submitService: SubmitUserService,
    private domainsService: DevelopDomainsService,
    private logger: NGXLogger
  ) {
    this.closeClick = new EventEmitter<void>();
    this.modelCreated = new EventEmitter<DevelopUserModel>();
    this.modelUpdated = new EventEmitter<{
      model: DevelopUserModel;
      oldModel: DevelopUserModel;
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
      .subscribe((state: SubmitUserState) => {
        if (state.status === StoreStatus.OK) {
          if (!state.oldModel) {
            this.modelCreated.emit(state.model);
          } else {
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
    if (this.user) {
      data.id = this.user.id;
    }
    this.submitService.next({
      data,
      oldModel: this.user,
    });
  }

  onChangeStateId(stateId: string) {
    const citiesUtil = this.domainsService.getInstance('modalCities');
    citiesUtil.next({
      urlParams: new HttpParams({
        fromObject: {
          parentId: stateId,
          status: DevelopDomainStatusEnum.ACTIVE,
          orderBy: 'nombre',
        },
      }),
    });
  }
}
