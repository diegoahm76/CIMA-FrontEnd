import {Injectable} from '@angular/core';
import {FormGroup, AbstractControl, FormControl} from '@angular/forms';

import {ApplicationError} from '@shared/utils';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  resetFormGroup(form: FormGroup, baseModel?: any, skip: string[] = []) {
    let field: AbstractControl;
    let value: any;
    for (const fieldName in form.controls) {
      if (skip.includes(fieldName)) {
        continue;
      }

      field = form.get(fieldName);
      if (!(field instanceof FormControl)) {
        continue;
      }

      if (
        baseModel &&
        (baseModel[fieldName] ||
          baseModel[fieldName] === '0' ||
          baseModel[fieldName] === 0)
      ) {
        value = baseModel[fieldName];
      } else {
        value = '';
      }
      if (value instanceof Array) {
        value = value.map((item: any) => {
          if (item !== null && typeof item !== 'string') {
            return String(item);
          }
          return item;
        });
      } else {
        if (
          value !== null &&
          typeof value !== 'string' &&
          !(value instanceof Date)
        ) {
          value = String(value);
        }
      }
      field.setValue(value);
    }
  }

  setFormErrors(error: ApplicationError | any, form: FormGroup) {
    if (!(error instanceof ApplicationError)) {
      return;
    }

    let field: AbstractControl;
    for (const errorAtributo of (error as ApplicationError).attrs) {
      // @TODO: este mapeo deberia ir en la clase del modelo
      const attr: string = errorAtributo.attr;
      field = form.get(attr);
      if (!field) {
        console.warn(`no se encontro el campo "${attr}" en el formulario`);
        continue;
      }
      field.setErrors({remote: errorAtributo.errors});
      field.markAsTouched();
      field.markAsDirty();
    }
  }

  clearFormErrors(form: FormGroup) {
    let field: AbstractControl;
    for (const fieldName in form.controls) {
      if (!form.controls.hasOwnProperty(fieldName)) {
        continue;
      }
      field = form.get(fieldName);
      field.markAsUntouched();
      field.markAsPristine();
    }
  }
}
