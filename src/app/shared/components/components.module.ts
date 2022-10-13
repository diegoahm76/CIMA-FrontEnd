import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {TranslateModule} from '@ngx-translate/core';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {NgSelectModule} from '@ng-select/ng-select';
import {HighchartsChartModule} from 'highcharts-angular';
// import {NgxUploaderModule} from 'ngx-uploader';
import {FilePondModule, registerPlugin} from 'ngx-filepond';
import * as FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import * as FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';

import {BasicComponentsModule} from '@shared/basic-components/basic-components.module';
import {DirectivesModule} from '@shared/directives/directives.module';
import {
  ActivationSwitchComponent,
  // FieldErrorComponent,
  HighchartComponent,
  // InfinitePaginatorComponent,
  ModalConfirmComponent,
  NoRecordsComponent,
  // PaginatorComponent,
  TreeComponent,
  UploadFileComponent,
  UploadLocalFileComponent,
  // UploadFileComponent,
  // UploadGCSFileComponent,
  // UploadGCSMultipleFilesComponent,
  // SelectComponent
} from '.';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    TranslateModule,
    TooltipModule,
    NgSelectModule,
    // NgxUploaderModule,
    HighchartsChartModule,
    FilePondModule,

    BasicComponentsModule,
    DirectivesModule,
  ],
  declarations: [
    ActivationSwitchComponent,
    // FieldErrorComponent,
    HighchartComponent,
    // InfinitePaginatorComponent,
    ModalConfirmComponent,
    NoRecordsComponent,
    // PaginatorComponent,
    TreeComponent,
    // UploadFileComponent,
    // UploadGCSFileComponent,
    // UploadGCSMultipleFilesComponent,
    UploadFileComponent,
    UploadLocalFileComponent,
    //
    // SelectComponent
  ],
  exports: [
    ActivationSwitchComponent,
    // FieldErrorComponent,
    HighchartComponent,
    // InfinitePaginatorComponent,
    ModalConfirmComponent,
    NoRecordsComponent,
    // PaginatorComponent,
    TreeComponent,
    // UploadFileComponent,
    // UploadGCSFileComponent,
    // UploadGCSMultipleFilesComponent,
    UploadFileComponent,
    UploadLocalFileComponent,
    //
    // SelectComponent
  ],
})
export class ComponentsModule {}
