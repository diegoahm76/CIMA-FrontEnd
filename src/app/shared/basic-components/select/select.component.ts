import {
  Component,
  forwardRef,
  Input,
  EventEmitter,
  Output,
  SimpleChanges,
  OnChanges,
  OnInit,
} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {StoreStatus} from '@shared/enums';
import {Model} from '@shared/models';

const noop = () => {};

const CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectComponent),
  multi: true,
};

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class SelectComponent
  implements OnChanges, OnInit, ControlValueAccessor {
  // Placeholders for the callbacks which are later providesd
  // by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  // Esta linea es solamente cuando se usa el componente ng-select
  @Output() onChange: EventEmitter<string>;

  // The internal data model
  private innerValue: string;

  @Input()
  status: string;
  @Input()
  list?: Array<Model | {strId: string; _label: string}>;
  @Input()
  multiple = false;
  @Input()
  placeholder?: string;
  @Input()
  small = false;

  disabled: boolean;
  currentPlaceholder: string;
  previousPlaceholder: string;

  storeStatus = StoreStatus;

  constructor(private translate: TranslateService, private logger: NGXLogger) {
    // Esta linea es solamente cuando se usa el componente ng-select
    this.onChange = new EventEmitter<string>();

    this.innerValue = '';
    this.disabled = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.placeholder) {
      if (changes.placeholder.currentValue) {
        this.currentPlaceholder = changes.placeholder.currentValue;
        this.previousPlaceholder = this.currentPlaceholder;
      } else {
        // Vuelve al mensaje por defecto
        this.translate
          .get('selects.select_an_option')
          .subscribe((res: string) => {
            this.currentPlaceholder = res;
            this.previousPlaceholder = this.currentPlaceholder;
          });
      }
    }

    if (changes.loading) {
      if (changes.loading.currentValue) {
        this.translate.get('selects.loading').subscribe((res: string) => {
          this.currentPlaceholder = res;
        });
      } else {
        this.currentPlaceholder = this.previousPlaceholder;
      }
    }
  }

  ngOnInit() {
    if (!this.previousPlaceholder) {
      // Mensaje por defecto
      this.translate
        .get('selects.select_an_option')
        .subscribe((res: string) => {
          this.currentPlaceholder = res;
          this.previousPlaceholder = this.currentPlaceholder;
        });
    }
  }

  // From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  // Get accessor
  get value(): string {
    // Este if es solamente cuando se usa el componente ng-select
    if (this.innerValue === '') {
      return null;
    }
    return this.innerValue;
  }

  // Set accessor including call the onchange callback
  set value(value: string) {
    if (value !== this.innerValue) {
      // Este if es solamente cuando se usa el componente ng-select
      if (value === null) {
        value = '';
      }
      this.innerValue = value;
      this.onChangeCallback(value);
      // Esta linea es solamente cuando se usa el componente ng-select
      this.onChange.emit(value);
    }
  }

  // Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }
}
