import {Observable, ReplaySubject} from 'rxjs';
import {shareReplay} from 'rxjs/operators';

import {TranslateService} from '@ngx-translate/core';

export class SelectPlaceholderUtil {
  subject: ReplaySubject<string>;
  placeholder$: Observable<string>;

  messages: {[key: string]: string};

  constructor(translate: TranslateService) {
    this.subject = new ReplaySubject<string>(1);

    this.placeholder$ = this.subject.pipe(shareReplay(1));

    this.messages = {};

    this.setDefaultPlaceholder(translate.get('selects.select_an_option'));
  }

  setPlaceholder(key: string, msg$: Observable<string>) {
    msg$.subscribe((msg: string) => {
      this.messages[key] = msg;
    });
  }

  placeholder(key: string) {
    this.subject.next(this.messages[key]);
  }

  setDefaultPlaceholder(msg$: Observable<string>) {
    msg$.subscribe((msg: string) => {
      this.messages.default = msg;
      this.defaultPlaceholder();
    });
  }

  defaultPlaceholder() {
    this.placeholder('default');
  }
}
