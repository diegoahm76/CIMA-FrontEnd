import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Params} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

import {FormService} from '@shared/services';
import {LoginState} from '../../services';
import {ButtonLabelUtil} from '@shared/utils';
import {StoreStatus} from '@shared/enums';

@Component({
  selector: 'app-login-form-ui',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnDestroy, OnInit {
  @Input()
  state$: Observable<LoginState>;
  @Output()
  submitClick: EventEmitter<Params>;

  private unsubscribe = new Subject<void>();

  form: FormGroup;

  submitButton: ButtonLabelUtil;

  storeStatus = StoreStatus;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private formService: FormService,
    private logger: NGXLogger
  ) {
    this.submitClick = new EventEmitter<Params>();
  }

  ngOnInit() {
    this.initButtonLabels();
    this.initForm();
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

  private initForm() {
    // Modelo asociado al formulario
    this.form = this.fb.group({
      // @TODO
      // Validators.compose([Validators.required, CustomValidators.email]),
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  private initSubscriptions() {
    this.state$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((state: LoginState) => {
        if (state.status === StoreStatus.LOADING) {
          this.submitButton.loadingLabel();
        } else if (state.status === StoreStatus.ERROR) {
          this.submitButton.defaultLabel();

          // Asocia los errores del api al formulario
          this.formService.setFormErrors(state.error, this.form);
        }
      });
  }

  submit({value, valid}: {value: Params; valid: boolean}) {
    const formData = {...value};
    this.submitClick.emit(formData);
  }
}
