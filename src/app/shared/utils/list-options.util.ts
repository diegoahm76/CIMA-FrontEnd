import {Paginator} from '@shared/interfaces';
import {Model} from '@shared/models/model';
import {ApplicationError} from '@shared/utils/application-error';

export class ListOptions {
  initialized: boolean;
  loading: boolean;
  error: ApplicationError | any;
  list: Model[];
  paginator: Paginator;

  constructor() {
    this.initialized = true;
    this.loading = true;
    // @TODO: ver si se inicializa
    // this.list = [];
  }
}
