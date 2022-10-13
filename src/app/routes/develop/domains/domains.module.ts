import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

import {TranslateModule} from '@ngx-translate/core';
import {ModalModule} from 'ngx-bootstrap/modal';
import {TooltipModule} from 'ngx-bootstrap/tooltip';

import {BasicComponentsModule} from '@shared/basic-components/basic-components.module';
import {ComponentsModule} from '@shared/components/components.module';
import {
  PrivatePageGuardService,
  StaticSelectOptionsService,
} from '@shared/services';
import {DeleteService, SubmitService, TreeService} from './shared/services';
import {
  DomainDetailsComponent,
  DomainFormModalComponent,
  DomainsFiltersComponent,
  StatusBadgeComponent,
} from './shared/components';
import {
  DomainsTreeContainerComponent,
  DomainsFiltersContainerComponent,
  DomainDetailsContainerComponent,
  DomainFormModalContainerComponent,
  DeleteDomainContainerComponent,
  ActivateDomainContainerComponent,
} from './domains-tree-container';

const routes: Routes = [
  {
    path: '',
    data: {id: 'module.develop.domains', action: 'view'},
    canActivate: [PrivatePageGuardService],
    component: DomainsTreeContainerComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,

    TranslateModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),

    BasicComponentsModule,
    ComponentsModule,
  ],
  declarations: [
    DomainsTreeContainerComponent,
    DomainsFiltersContainerComponent,
    DomainDetailsContainerComponent,
    DomainFormModalContainerComponent,
    DeleteDomainContainerComponent,
    ActivateDomainContainerComponent,

    DomainsFiltersComponent,
    DomainDetailsComponent,
    DomainFormModalComponent,

    StatusBadgeComponent,
  ],
  exports: [RouterModule],
  providers: [
    StaticSelectOptionsService,
    TreeService,
    SubmitService,
    DeleteService,
  ],
})
export class DomainsModule {}
