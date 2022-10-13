/* tslint:disable:no-unused-variable */

import {TestBed, async, inject} from '@angular/core/testing';
import {Footer1Component} from './footer.component';

import {SettingsService} from '../../core/settings/settings.service';

describe('Component: Footer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SettingsService],
    }).compileComponents();
  });

  it('should create an instance', async(
    inject([SettingsService], (settingsService) => {
      let component = new Footer1Component(settingsService);
      expect(component).toBeTruthy();
    })
  ));
});
