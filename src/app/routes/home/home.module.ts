import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {BasicComponentsModule} from '@app/shared/basic-components/basic-components.module';

import {PrivatePageGuardService} from '@shared/services';
import {ModalModule} from 'ngx-bootstrap/modal';
import {HomeComponent} from './home/home.component';
import {SurveyPopulationComponent} from './survey-population/survey-population.component';

const routes: Routes = [
  {
    path: '',
    data: {id: 'module.home', action: 'view'},
    canActivate: [PrivatePageGuardService],
    component: HomeComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    ModalModule.forRoot(),
    ReactiveFormsModule,
    BasicComponentsModule,
    // ComponentsModule
  ],
  declarations: [HomeComponent, SurveyPopulationComponent],
  exports: [RouterModule],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule {}
