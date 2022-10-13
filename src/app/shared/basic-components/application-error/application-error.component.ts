import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs';

import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

import {ApplicationError} from '@shared/utils';

@Component({
  selector: 'app-application-error',
  templateUrl: './application-error.component.html',
  styleUrls: ['./application-error.component.scss']
})
export class ApplicationErrorComponent implements OnChanges {
  @Input()
  error: ApplicationError | any;

  message$: Observable<string>;

  constructor(private translate: TranslateService, private logger: NGXLogger) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.error.currentValue) {
      if (changes.error.currentValue instanceof ApplicationError) {
        this.message$ = (this.error as ApplicationError).message$;
      } else {
        // this.logger.error(changes.error.currentValue);
        this.message$ = this.translate.get('http_codes.default');
      }
    }
  }
}
