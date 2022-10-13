import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import * as Highcharts from 'highcharts';
import {NGXLogger} from 'ngx-logger';

import {ChartsService} from '../shared/services';
import {ChartsState, ChartsUtil} from '../shared/utils';
import {StoreStatus} from '@shared/enums';

@Component({
  templateUrl: './charts-container.component.html'
})
export class ChartsContainerComponent implements OnInit {
  private unsubscribe = new Subject<void>();

  chart1Util: ChartsUtil;
  chart1State$: Observable<ChartsState>;
  chart1Config: Highcharts.Options;

  chart2Util: ChartsUtil;
  chart2State$: Observable<ChartsState>;
  chart2Config: Highcharts.Options;

  constructor(
    private chartsService: ChartsService,
    private logger: NGXLogger
  ) {}

  ngOnInit() {
    this.initServices();
    this.initSubscriptions();
  }

  private initServices() {
    this.chart1Util = this.chartsService.getInstance('chart1');
    this.chart1State$ = this.chart1Util.getState();
    this.chart1Util.next({});

    this.chart2Util = this.chartsService.getInstance('chart2');
    this.chart2State$ = this.chart2Util.getState();
    this.chart2Util.next({});
  }

  private initSubscriptions() {
    this.chart1State$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((state: ChartsState) => {
        if (state.status === StoreStatus.OK) {
          this.chart1Config = {
            chart: {
              spacing: [5, 0, 0, 0]
            },
            credits: {
              enabled: false
            },
            title: {
              text: `1. Registros cargados`
            },
            subtitle: {
              text: `Top 10 de ciudades`
            },
            legend: {
              enabled: false
            },
            plotOptions: {
              column: {
                opacity: 0.9
                // groupPadding: 0.05,
                // pointPadding: 0.05
              }
            },
            xAxis: {
              title: {
                text: 'Ciudades'
              },
              gridLineWidth: 1,
              categories: state.categories
            },
            yAxis: {
              title: {
                text: 'Número de registros'
              }
            },
            series: [
              {
                type: 'column',
                data: state.series[0]
              }
            ]
          };
        }
      });

    this.chart2State$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((state: ChartsState) => {
        if (state.status === StoreStatus.OK) {
          this.chart2Config = {
            chart: {
              spacing: [5, 0, 0, 0]
            },
            credits: {
              enabled: false
            },
            title: {
              text: `1. Registros cargados`
            },
            subtitle: {
              text: `Top 10 de ciudades`
            },
            legend: {
              enabled: false
            },
            plotOptions: {
              column: {
                opacity: 0.9
                // groupPadding: 0.05,
                // pointPadding: 0.05
              }
            },
            xAxis: {
              title: {
                text: 'Ciudades'
              },
              gridLineWidth: 1,
              categories: state.categories
            },
            yAxis: {
              title: {
                text: 'Número de registros'
              }
            },
            series: [
              {
                type: 'column',
                data: state.series[0]
              }
            ]
          };
        }
      });
  }

  downloadChart(chartIndex: number) {
    this.logger.info('downloadChart', chartIndex);
  }
}
