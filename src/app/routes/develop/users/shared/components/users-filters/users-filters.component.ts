import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';
import {Params} from '@angular/router';

import * as _ from 'lodash';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

import {FormService} from '@shared/services';
import {SelectPlaceholderUtil, StaticSelectOptionsState} from '@shared/utils';
import {DevelopDomainsState, DevelopUsersState} from '@app/routes/shared/utils';
import {StoreStatus} from '@shared/enums';

@Component({
  selector: 'app-users-filters-ui',
  templateUrl: './users-filters.component.html',
})
export class UsersFiltersComponent implements OnInit {
  @Input()
  state: DevelopUsersState;
  @Input()
  statesState: DevelopDomainsState;
  @Input()
  citiesState: DevelopDomainsState;
  @Input()
  rolesState: StaticSelectOptionsState;
  @Input()
  statusesState: StaticSelectOptionsState;
  @Input()
  params?: Params;
  @Output()
  searchClick: EventEmitter<Params>;
  @Output()
  newInModalClick: EventEmitter<void>;
  @Output()
  newClick: EventEmitter<void>;
  @Output()
  stateIdChange: EventEmitter<string>;

  form: FormGroup;

  cityPlaceholder: SelectPlaceholderUtil;

  storeStatus = StoreStatus;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private formService: FormService,
    private logger: NGXLogger
  ) {
    this.searchClick = new EventEmitter<Params>();
    this.newInModalClick = new EventEmitter<void>();
    this.newClick = new EventEmitter<void>();
    this.stateIdChange = new EventEmitter<string>();
  }

  ngOnInit() {
    this.initPlaceholders();
    this.initForm();

    this.onChangeStateId(this.form.get('stateId').value, false);
  }

  private initPlaceholders() {
    this.cityPlaceholder = new SelectPlaceholderUtil(this.translate);
    this.cityPlaceholder.setPlaceholder(
      'state',
      this.translate.get('selects.select_the_state')
    );
  }

  private initForm() {
    // Modelo asociado al formulario
    this.form = this.fb.group({
      search: [''],
      stateId: [''],
      cityId: [''],
      role: [''],
      status: [''],
    });

    if (this.params) {
      // Actualiza el modelo del formulario con los parametros recibidos
      this.formService.resetFormGroup(this.form, this.params);
    }
  }

  search({value, valid}: {value: {[param: string]: string}; valid: boolean}) {
    // Filtra los parametros diferentes a false
    const filteredParams = _.pickBy(value, (v) => Boolean(v)) as Params;
    this.searchClick.emit(filteredParams);
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
