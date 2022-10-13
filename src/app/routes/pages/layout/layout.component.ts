import {Component} from '@angular/core';

import {SettingsService} from '@app/core/settings/settings.service';

@Component({
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {

  constructor(public settingsService: SettingsService) {}
}
