import {Component, Output, EventEmitter, Input, OnInit, OnDestroy} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

import {LoginState} from '../../services';
import {ButtonLabelUtil} from '@shared/utils';
import {StoreStatus} from '@shared/enums';

@Component({
  selector: 'app-login-button-ui',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.scss'],
})
export class LoginButtonComponent implements OnDestroy, OnInit {
  @Input()
  state$: Observable<LoginState>;
  @Output()
  signInClick: EventEmitter<void>;

  private unsubscribe = new Subject<void>();

  submitButton: ButtonLabelUtil;

  storeStatus = StoreStatus;

  constructor(
    private translate: TranslateService,
    private logger: NGXLogger
  ) {
    this.signInClick = new EventEmitter<void>();
  }

  ngOnInit() {
    this.initButtonLabels();
    this.initSubscriptions();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private initButtonLabels() {
    this.submitButton = new ButtonLabelUtil(
      this.translate.get('buttons.submit.ingresar'),
      this.translate.get('buttons.submit.ingresando')
    );
  }

  private initSubscriptions() {
    this.state$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((state: LoginState) => {
        if (state.status === StoreStatus.LOADING) {
          this.submitButton.loadingLabel();
        } else if (state.status === StoreStatus.ERROR) {
          this.submitButton.defaultLabel();
        }
      });
  }
}
