import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Params} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

import {FormService, ScrollService} from '@shared/services';
import {SubmitUploadFileState} from '../../services';
import {ButtonLabelUtil} from '@shared/utils';
import {StoreStatus} from '@shared/enums';

@Component({
  selector: 'app-upload-file-form-ui',
  templateUrl: './upload-file-form.component.html',
})
export class UploadFileFormComponent implements OnDestroy, OnInit {
  @Input()
  state$: Observable<SubmitUploadFileState>;
  @Output()
  submitClick: EventEmitter<Params>;

  private unsubscribe = new Subject<void>();

  title: string;
  form: FormGroup;
  submitButton: ButtonLabelUtil;

  storeStatus = StoreStatus;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private formService: FormService,
    private scrollService: ScrollService,
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
      this.translate.get('buttons.submit.guardar'),
      this.translate.get('buttons.submit.guardando')
    );
  }

  private initForm() {
    // Modelo asociado al formulario
    this.form = this.fb.group({
      field1: ['', Validators.required],
      field2: ['', Validators.required],
      file: ['', Validators.required],
    });

    this.title = 'Nuevo registro';
  }

  private initSubscriptions() {
    this.state$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((state: SubmitUploadFileState) => {
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
}
