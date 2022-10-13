import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {NGXLogger} from 'ngx-logger';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  constructor(
    @Inject(DOCUMENT) private document: any,
    private logger: NGXLogger
  ) {}

  scrollTo(to, duration, isModal = false) {
    let element;
    if (isModal) {
      element = this.document.querySelector('div.modal');
    } else {
      element = this.document.scrollingElement || this.document.documentElement;
    }
    const start = element.scrollTop;
    const change = to - start;
    const startDate = +new Date();
    // const t = current time
    // const b = start value
    // const c = change in value
    // const d = duration
    const easeInOutQuad = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) {
        return (c / 2) * t * t + b;
      }
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };
    const animateScroll = () => {
      const currentDate = +new Date();
      const currentTime = currentDate - startDate;
      element.scrollTop = parseInt(
        easeInOutQuad(currentTime, start, change, duration),
        10
      );
      if (currentTime < duration) {
        requestAnimationFrame(animateScroll);
      } else {
        element.scrollTop = to;
      }
    };
    animateScroll();
  }
}
