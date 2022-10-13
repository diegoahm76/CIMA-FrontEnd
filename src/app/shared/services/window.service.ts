import {Injectable} from '@angular/core';

const _window = () => {
  // Return the global native browser window object
  return window;
};

@Injectable({
  providedIn: 'root',
})
export class WindowRef {
  get nativeWindow() {
    return _window();
  }
}
