import {Observable, ReplaySubject} from 'rxjs';
import {shareReplay} from 'rxjs/operators';

export class ButtonLabelUtil {
  subject: ReplaySubject<string>;
  label$: Observable<string>;

  messages: {
    default?: string;
    loading?: string;
  };

  constructor(
    defaultMessage: Observable<string>,
    loadingMessage: Observable<string>
  ) {
    this.subject = new ReplaySubject<string>(1);

    this.label$ = this.subject.pipe(shareReplay(1));

    this.messages = {};

    defaultMessage.subscribe((msg: string) => {
      this.messages.default = msg;
      this.defaultLabel();
    });
    loadingMessage.subscribe((msg: string) => {
      this.messages.loading = msg;
    });
  }

  defaultLabel() {
    this.subject.next(this.messages.default);
  }

  loadingLabel() {
    this.subject.next(this.messages.loading);
  }
}
