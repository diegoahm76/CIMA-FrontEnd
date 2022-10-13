import {map, shareReplay} from 'rxjs/operators';
import {ReplaySubject} from 'rxjs';

import {NGXLogger} from 'ngx-logger';

import {Store} from '@shared/services/store.service';

type Status = 'ok';

interface ListItem {
  value: string;
  label: string;
}

interface StreamInput {
  list: ListItem[];
}

export interface StaticSelectOptionsState {
  status: Status;
  list?: {strId: string; _label: string}[];
}

export class StaticSelectOptionsUtil extends Store<
  StreamInput,
  StaticSelectOptionsState
> {
  private logger: NGXLogger;

  constructor(dependencies: {logger: NGXLogger}) {
    super();

    this.logger = dependencies.logger;

    this.subject = new ReplaySubject<StreamInput>(1);

    this.initState();
  }

  protected initState() {
    this.state$ = this.subject.pipe(
      map(({list}: StreamInput) => {
        return {
          status: 'ok' as Status,
          list: list.map((item: ListItem) => {
            return {strId: item.value, _label: item.label};
          }),
        };
      }),
      shareReplay(1)
    );
  }

  next(value: StreamInput) {
    this.setState(value);
  }
}
