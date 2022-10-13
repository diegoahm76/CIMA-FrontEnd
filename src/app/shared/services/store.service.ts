import {Observable, Subject} from 'rxjs';

export abstract class Store<T, U> {
  protected subject: Subject<T>;
  protected state$: Observable<U>;

  protected abstract initState();

  getState(): Observable<U> {
    return this.state$;
  }

  setState(nextState: T) {
    this.subject.next(nextState);
  }

  abstract next(value: any);
}
