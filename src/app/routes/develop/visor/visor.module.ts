import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {
  PrivatePageGuardService,
  StaticSelectOptionsService,
} from '@shared/services';
import {VisorComponent} from './visor.component';
import {ComponentsModule} from '@app/shared/components/components.module';
import {BasicComponentsModule} from '@app/shared/basic-components/basic-components.module';
import {PipesModule} from '@app/shared/pipes/pipes.module';
import {ReactiveFormsModule} from '@angular/forms';
// import { PowerBIEmbedModule } from 'powerbi-client-angular';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
const routes: Routes = [
  {
    path: '',
    data: {id: 'module.develop.visor', action: 'view'},
    canActivate: [PrivatePageGuardService],
    component: VisorComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    TranslateModule,
    BsDatepickerModule.forRoot(),
    BasicComponentsModule,
    ComponentsModule,
    PipesModule,
    // PowerBIEmbedModule,
  ],
  declarations: [VisorComponent],
  providers: [StaticSelectOptionsService],
  exports: [RouterModule],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class VisorModule {}
