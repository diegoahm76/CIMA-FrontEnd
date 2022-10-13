import {
  Component,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Params} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

import {FormService, ScrollService} from '@shared/services';
import {SubmitState} from '../../services';
import {ButtonLabelUtil} from '@shared/utils';
import {StoreStatus} from '@shared/enums';
import {DevelopDomainTypeValues} from '@app/routes/shared/enums';
import {DevelopDomainModel} from '@app/routes/shared/models';

@Component({
  selector: 'app-domain-form-modal-ui',
  templateUrl: './domain-form-modal.component.html',
})
export class DomainFormModalComponent implements OnInit, OnDestroy {
  @Input()
  state$: Observable<SubmitState>;
  @Input()
  domain?: DevelopDomainModel;
  @Input()
  parentModel: DevelopDomainModel;
  @Input()
  type: string;
  @Output()
  closeClick: EventEmitter<void>;
  @Output()
  submitClick: EventEmitter<Params>;

  private unsubscribe = new Subject<void>();

  title: string;
  form: FormGroup;
  submitButton: ButtonLabelUtil;

  storeStatus = StoreStatus;
  domainTypeValues = DevelopDomainTypeValues;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private formService: FormService,
    private scrollService: ScrollService,
    private logger: NGXLogger
  ) {
    this.closeClick = new EventEmitter<void>();
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
      this.translate.get('buttons.submit.guardar'),
      this.translate.get('buttons.submit.guardando')
    );
  }

  private initForm() {
    // Modelo asociado al formulario
    this.form = this.fb.group({
      value: ['', Validators.required],
    });

    if (!this.domain) {
      this.title = 'Nuevo registro de dominio controlado';
    } else {
      this.title = 'Editar registro de dominio controlado';
      // Inicializa los valores de los campos del formulario
      this.formService.resetFormGroup(this.form, this.domain);
    }
  }

  private initSubscriptions() {
    this.state$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((state: SubmitState) => {
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
    this.submitClick.emit(value);
  }
}
