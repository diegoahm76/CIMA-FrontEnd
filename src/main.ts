/*!
 *
 * Angle - Bootstrap Admin Template
 *
 * Version: 4.8.1
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: https://wrapbootstrap.com/help/licenses
 *
 */

import './vendor.ts';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Eduardo
if (environment.env === 'production') {
  enableProdMode();
}

const p = platformBrowserDynamic().bootstrapModule(AppModule);
p.then(() => { (window as any).appBootstrap && (window as any).appBootstrap(); });
// .catch(err => console.error(err));
