import {Component} from '@angular/core';
import {SettingsService} from '../../../core/settings/settings.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
// import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
})
export class RecoverComponent {
  valForm: FormGroup;

  constructor(public settings: SettingsService, fb: FormBuilder) {
    this.valForm = fb.group({
      // 'email': [null, Validators.compose([Validators.required, CustomValidators.email])]
      email: [null, Validators.required],
    });
  }

  submitForm($ev, value: any) {
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      console.log('Valid!');
      console.log(value);
    }
  }
}
