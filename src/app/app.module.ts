import {BrowserAnimationsModule} from '@angular/platform-browser/animations'; // this is needed!
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {CoreModule} from './core/core.module';
import {LayoutModule} from './layout/layout.module';
import {RoutesModule} from './routes/routes.module';
import {InitModule} from '@app/init/init.module';
import {PagesModule} from '@app/routes/pages/pages.module';
import {AppComponent} from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule, // required for ng2-tag-input

    InitModule,

    CoreModule,
    LayoutModule,
    RoutesModule,

    PagesModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
