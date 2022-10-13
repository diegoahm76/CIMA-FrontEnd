import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {TranslateModule} from '@ngx-translate/core';
import {NgSelectModule} from '@ng-select/ng-select';

import {LoadingIconClassPipe, NgOptionPipe} from '@shared/pipes';
import {
  ApplicationErrorComponent,
  FieldErrorComponent,
  LoadingComponent,
  SelectComponent,
} from '.';

@NgModule({
  imports: [CommonModule, FormsModule, TranslateModule, NgSelectModule],
  declarations: [
    LoadingIconClassPipe,
    NgOptionPipe,

    ApplicationErrorComponent,
    FieldErrorComponent,
    LoadingComponent,
    SelectComponent
  ],
  exports: [
    LoadingIconClassPipe,
    NgOptionPipe,

    ApplicationErrorComponent,
    FieldErrorComponent,
    LoadingComponent,
    SelectComponent,
  ],
})
export class BasicComponentsModule {}
