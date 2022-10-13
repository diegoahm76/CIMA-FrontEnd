import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Params} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

import {FormService, ScrollService} from '@shared/services';
import {SubmitUserState} from '../../services';
import {
  ButtonLabelUtil,
  SelectPlaceholderUtil,
  StaticSelectOptionsState,
} from '@shared/utils';
import {DevelopDomainsState} from '@app/routes/shared/utils';
import {StoreStatus} from '@shared/enums';
import {DevelopUserModel} from '@app/routes/shared/models';

@Component({
  selector: 'app-user-form-modal-ui',
  templateUrl: './user-form-modal.component.html',
})
export class UserFormModalComponent implements OnDestroy, OnInit {
  @Input()
  state$: Observable<SubmitUserState>;
  @Input()
  user?: DevelopUserModel;
  @Input()
  statesState: DevelopDomainsState;
  @Input()
  citiesState: DevelopDomainsState;
  @Input()
  rolesState: StaticSelectOptionsState;
  @Output()
  closeClick: EventEmitter<void>;
  @Output()
  submitClick: EventEmitter<Params>;
  @Output()
  stateIdChange: EventEmitter<string>;

  private unsubscribe = new Subject<void>();

  title: string;
  form: FormGroup;
  submitButton: ButtonLabelUtil;

  cityPlaceholder: SelectPlaceholderUtil;

  storeStatus = StoreStatus;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private formService: FormService,
    private scrollService: ScrollService,
    private logger: NGXLogger
  ) {
    this.closeClick = new EventEmitter<void>();
    this.submitClick = new EventEmitter<Params>();
    this.stateIdChange = new EventEmitter<string>();
  }

  ngOnInit() {
    this.initPlaceholders();
    this.initButtonLabels();
    this.initForm();
    this.initSubscriptions();

    this.onChangeStateId(this.form.get('stateId').value, false);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private initPlaceholders() {
    this.cityPlaceholder = new SelectPlaceholderUtil(this.translate);
    this.cityPlaceholder.setPlaceholder(
      'state',
      this.translate.get('selects.select_the_state')
    );
  }

  private initButtonLabels() {
    this.submitButton = new ButtonLabelUtil(
      this.translate.get('buttons.submit.guardar'),
      this.translate.get('buttons.submit.guardando')
    );
  }

  private initForm() {
    // Modelo asociado al formulario
    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      // @TODO
      email: ['', Validators.required],
      stateId: ['', Validators.required],
      cityId: ['', Validators.required],
      role: ['', Validators.required],
    });

    if (!this.user) {
      this.title = 'Nuevo usuario';
    } else {
      this.title = 'Editar usuario';
      // Inicializa los valores de los campos del formulario
      this.formService.resetFormGroup(this.form, this.user);
    }
  }

  private initSubscriptions() {
    this.state$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((state: SubmitUserState) => {
        if (state.status === StoreStatus.LOADING) {
          this.submitButton.loadingLabel();
        } else if (state.status === StoreStatus.ERROR) {
          this.submitButton.defaultLabel();

          // Asocia los errores del api al formulario
          this.formService.setFormErrors(state.error, this.form);

          // Sube el scroll
          this.scrollService.scrollTo(0, 200, true);
        }
      });
  }

  submit({value, valid}: {value: Params; valid: boolean}) {
    this.submitClick.emit({...value});
  }

  onChangeStateId(stateId: string, reset = true) {
    const city = this.form.get('cityId') as FormControl;
    if (reset) {
      city.reset('');
    }

    if (stateId) {
      this.cityPlaceholder.defaultPlaceholder();
      city.enable();
      this.stateIdChange.emit(stateId);
    } else {
      this.cityPlaceholder.placeholder('state');
      city.disable();
    }
  }
}
