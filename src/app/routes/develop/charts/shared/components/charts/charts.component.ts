import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable} from 'rxjs';

import * as Highcharts from 'highcharts';
import {NGXLogger} from 'ngx-logger';

import {ChartsState} from '../../utils';

@Component({
  selector: 'app-charts-ui',
  templateUrl: './charts.component.html'
})
export class ChartsComponent {
  @Input()
  chart1State$: Observable<ChartsState>;
  @Input()
  chart1Config: Highcharts.Options;
  @Input()
  chart2State$: Observable<ChartsState>;
  @Input()
  chart2Config: Highcharts.Options;
  @Output()
  downloadChart: EventEmitter<number>;

  constructor(
    private logger: NGXLogger
  ) {
    this.downloadChart = new EventEmitter<number>();
  }
}
