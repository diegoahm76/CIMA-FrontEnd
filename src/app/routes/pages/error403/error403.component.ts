import {Component} from '@angular/core';

import {SettingsService} from '../../../core/settings/settings.service';

@Component({
  templateUrl: './error403.component.html'
})
export class Error403Component {
  constructor(public settings: SettingsService) {}
}
