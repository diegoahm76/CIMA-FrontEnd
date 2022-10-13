import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

import {TranslateModule} from '@ngx-translate/core';
import {ModalModule} from 'ngx-bootstrap/modal';
import {TooltipModule} from 'ngx-bootstrap/tooltip';

import {BasicComponentsModule} from '@shared/basic-components/basic-components.module';
import {ComponentsModule} from '@shared/components/components.module';
import {PipesModule} from '@shared/pipes/pipes.module';
import {
  ListService,
  PrivatePageGuardService,
  StaticSelectOptionsService,
} from '@shared/services';
import {
  DevelopDomainsService,
  DevelopUsersService,
} from '@app/routes/shared/services';
import {SubmitUserService, DeleteUserService} from './shared/services';
import {
  UserListComponent,
  UsersFiltersComponent,
  UserFormModalComponent,
  StatusBadgeComponent,
  RoleBadgeComponent,
} from './shared/components';
import {
  UserListContainerComponent,
  UsersFiltersContainerComponent,
  UserFormModalContainerComponent,
  DeleteUserContainerComponent,
  ActivateUserContainerComponent,
} from './user-list-container';

const routes: Routes = [
  {
    path: '',
    data: {id: 'module.develop.users', action: 'view'},
    canActivate: [PrivatePageGuardService],
    component: UserListContainerComponent,
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
    PipesModule,
  ],
  declarations: [
    UserListContainerComponent,
    UsersFiltersContainerComponent,
    UserFormModalContainerComponent,
    DeleteUserContainerComponent,
    ActivateUserContainerComponent,

    UserListComponent,
    UsersFiltersComponent,
    // @TODO
    // UserDetailsModalComponent,
    UserFormModalComponent,

    RoleBadgeComponent,
    StatusBadgeComponent,
  ],
  exports: [RouterModule],
  providers: [
    ListService,
    StaticSelectOptionsService,
    DevelopUsersService,
    SubmitUserService,
    DeleteUserService,
    DevelopDomainsService,
  ],
})
export class UsersModule {}
