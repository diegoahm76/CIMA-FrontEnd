import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Params} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import * as _ from 'lodash';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

import {FormService} from '@shared/services';
import {StaticSelectOptionsState} from '@shared/utils';
import {TreeState} from '../../utils';
import {StoreStatus} from '@shared/enums';

@Component({
  selector: 'app-domains-filters-ui',
  templateUrl: './domains-filters.component.html',
})
export class DomainsFiltersComponent implements OnInit {
  @Input()
  state: TreeState;
  @Input()
  typesState: StaticSelectOptionsState;
  @Input()
  params?: Params;
  @Output()
  searchClick: EventEmitter<Params>;

  form: FormGroup;

  storeStatus = StoreStatus;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private formService: FormService,
    private logger: NGXLogger
  ) {
    this.searchClick = new EventEmitter<Params>();
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    // Modelo asociado al formulario
    this.form = this.fb.group({
      type: ['', Validators.required],
    });

    if (this.params) {
      // Actualiza el modelo del formulario con los parametros recibidos
      this.formService.resetFormGroup(this.form, this.params);
    }
  }

  search({value, valid}: {value: {[param: string]: string}; valid: boolean}) {
    // Filtra los parametros diferentes a false
    const filteredModel = _.pickBy(value, (v) => Boolean(v)) as Params;
    this.searchClick.emit(filteredModel);
  }
}
