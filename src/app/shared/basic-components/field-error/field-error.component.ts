import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';

import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-field-error',
  templateUrl: './field-error.component.html',
})
export class FieldErrorComponent implements OnChanges {
  @Input() errors?: ValidationErrors;
  @Input() visible: boolean;

  _errors: Observable<string>[];

  constructor(private translate: TranslateService, private logger: NGXLogger) {
    this._errors = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.errors && !changes.errors.isFirstChange()) {
      if (!changes.errors.currentValue) {
        this._errors = [];
      } else {
        if (!changes.errors.currentValue.remote) {
          // Errores locales
          const keys = Object.keys(changes.errors.currentValue);
          // Se traducen los mensajes de error
          this._errors = keys.map((item: string) =>
            this.translate.get(`validation.${item}`)
          );
        } else {
          // Errores remotos
          this._errors = changes.errors.currentValue.remote;
        }
      }
    }
  }
}
