import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

import * as Highcharts from 'highcharts';
import {NGXLogger} from 'ngx-logger';

import {StoreStatus} from '@app/shared/enums';

@Component({
  selector: 'app-highchart',
  templateUrl: './highchart.component.html'
})
export class HighchartComponent implements OnInit {
  @Input()
  state$: Observable<any>;
  @Input() config: Highcharts.Options;

  Highcharts: typeof Highcharts = Highcharts;  // required
  chartConstructor: string;  // optional string, defaults to 'chart'
  chartCallback: Highcharts.ChartCallbackFunction;  // optional function, defaults to null
  updateFlag: boolean;  // optional boolean
  oneToOneFlag: boolean;  // optional boolean, defaults to false
  runOutsideAngular: boolean;  // optional boolean, defaults to false

  storeStatus = StoreStatus;

  constructor(private logger: NGXLogger) {}

  ngOnInit() {
    this.chartConstructor = 'chart';
    this.updateFlag = false;
    this.oneToOneFlag = true;
    this.runOutsideAngular = false;

    this.chartCallback = chart => {
      this.logger.info('chartCallback', chart);
    };
  }
}
