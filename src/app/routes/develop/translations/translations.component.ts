import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

@Component({
  templateUrl: './translations.component.html'
})
export class TranslationsComponent implements OnInit {
  params: {[attr: string]: string};
  translation1: string;
  translation2: Observable<string>;

  constructor(private translate: TranslateService, private logger: NGXLogger) {
    this.params = {idioma: 'español'};
  }

  ngOnInit() {
    this.translate
      .get('develop.Hola', {value: 'mundo'})
      .subscribe((res: string) => {
        this.logger.info(res);
        this.translation1 = res;
      });

    this.translation2 = this.translate.get('develop.Hola', {value: 'world'});
  }
}
