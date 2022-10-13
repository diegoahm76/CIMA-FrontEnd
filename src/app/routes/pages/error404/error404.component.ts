import {Component} from '@angular/core';

import {SettingsService} from '../../../core/settings/settings.service';

@Component({
  templateUrl: './error404.component.html'
})
export class Error404Component {
  constructor(public settings: SettingsService) {}
}
