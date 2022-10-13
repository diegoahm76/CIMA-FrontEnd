import {Component, OnDestroy, OnInit} from '@angular/core';
import {Params} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {NGXLogger} from 'ngx-logger';

import {ForgotPasswordService, ForgotPasswordState} from '../shared/services';
import {StoreStatus} from '@shared/enums';

@Component({
  templateUrl: './forgot-password-container.component.html',
})
export class ForgotPasswordContainerComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();

  state$: Observable<ForgotPasswordState>;

  constructor(
    private forgotPasswordService: ForgotPasswordService,
    private logger: NGXLogger
  ) {}

  ngOnInit() {
    this.initServices();
    this.initSubscriptions();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private initServices() {
    this.state$ = this.forgotPasswordService.getState();
    this.forgotPasswordService.next({
      status: StoreStatus.INITIATED,
    });
  }

  private initSubscriptions() {
    this.state$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((state: ForgotPasswordState) => {
        if (state.status === StoreStatus.OK) {
        }
      });
  }

  submit(data: Params) {
    this.forgotPasswordService.next({
      data,
    });
  }
}
