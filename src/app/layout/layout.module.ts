import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {TranslateModule} from '@ngx-translate/core';
import {TabsModule} from 'ngx-bootstrap/tabs';

import {LayoutComponent} from './layout.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {HeaderComponent} from './header/header.component';
import {NavsearchComponent} from './header/navsearch/navsearch.component';
import {OffsidebarComponent} from './offsidebar/offsidebar.component';
import {UserblockComponent} from './sidebar/userblock/userblock.component';
import {UserblockService} from './sidebar/userblock/userblock.service';
import {Footer1Component} from './footer1/footer1.component';
import {Footer2Component} from './footer2/footer2.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,

    TranslateModule,
    TabsModule,
  ],
  declarations: [
    LayoutComponent,
    SidebarComponent,
    UserblockComponent,
    HeaderComponent,
    NavsearchComponent,
    OffsidebarComponent,

    Footer1Component,
    Footer2Component,
  ],
  exports: [
    LayoutComponent,
    SidebarComponent,
    UserblockComponent,
    HeaderComponent,
    NavsearchComponent,
    OffsidebarComponent,

    Footer1Component,
    Footer2Component,
  ],
  providers: [UserblockService],
})
export class LayoutModule {}
