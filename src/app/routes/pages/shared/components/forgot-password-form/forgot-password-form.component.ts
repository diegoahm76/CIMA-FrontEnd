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

import {SettingsService} from '@app/core/settings/settings.service';
import {FormService} from '@shared/services';
import {ForgotPasswordState} from '../../services';
import {ButtonLabelUtil} from '@shared/utils';
import {StoreStatus} from '@shared/enums';

@Component({
  selector: 'app-forgot-password-form-ui',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss'],
})
export class ForgotPasswordFormComponent implements OnDestroy, OnInit {
  @Input()
  state$: Observable<ForgotPasswordState>;
  @Output()
  submitClick: EventEmitter<Params>;

  private unsubscribe = new Subject<void>();

  form: FormGroup;

  submitButton: ButtonLabelUtil;

  storeStatus = StoreStatus;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    public settingsService: SettingsService,
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
      this.translate.get('buttons.submit.enviar'),
      this.translate.get('buttons.submit.enviando')
    );
  }

  private initForm() {
    // Modelo asociado al formulario
    this.form = this.fb.group({
      // @TODO
      // Validators.compose([Validators.required, CustomValidators.email]),
      email: ['', Validators.required],
    });
  }

  private initSubscriptions() {
    this.state$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((state: ForgotPasswordState) => {
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
