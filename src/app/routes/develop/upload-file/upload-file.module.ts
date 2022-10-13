import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

import {BasicComponentsModule} from '@shared/basic-components/basic-components.module';
import {ComponentsModule} from '@shared/components/components.module';
import {PrivatePageGuardService} from '@shared/services';
import {SubmitUploadFileService} from './shared/services';
import {UploadFileFormComponent} from './shared/components';
import {UploadFileFormContainerComponent} from './upload-file-form-container';

const routes: Routes = [
  {
    path: '',
    data: {id: 'module.develop.uploadFile', action: 'view'},
    canActivate: [PrivatePageGuardService],
    component: UploadFileFormContainerComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,

    BasicComponentsModule,
    ComponentsModule,
  ],
  declarations: [UploadFileFormContainerComponent, UploadFileFormComponent],
  exports: [RouterModule],
  providers: [SubmitUploadFileService],
})
export class UploadFileModule {}
