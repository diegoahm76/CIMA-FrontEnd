import {Component} from '@angular/core';

import {SettingsService} from '../../../core/settings/settings.service';

@Component({
  templateUrl: './error500.component.html'
})
export class Error500Component {
  constructor(public settings: SettingsService) {}
}
