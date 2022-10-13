import {Component, OnInit} from '@angular/core';

import {NGXLogger} from 'ngx-logger';

declare var Visor: any;

@Component({
  templateUrl: './visor.component.html',
  styleUrls: ['./map.css'],
})
export class VisorComponent implements OnInit {
  visor: typeof Visor;

  constructor(private logger: NGXLogger) {}

  ngOnInit() {
    this.initVisor();
  }

  private initVisor() {
    const layers = [
      {
        url: 'https://mapas.parquesnacionales.gov.co/services/pnn_sinap/wms?',
        type: 'wms',
        name: 'Runap',
        visible: true,
        topic: 'Runap',
        order: 1,
        description: 'Capa de Runap',
        options: {
          layers: 'pnn_sinap:rep_por_geom',
          query: `1=0`,
          transparent: true,
          format: 'image/png',
        },
      },
    ];
    this.visor = new Visor(
      'visor1',
      layers,
      {
        zoom: true,
        scale: true,
        measure: true,
        baseMap: true,
      },
      (state: string) => {
        let features = JSON.parse(state).features;
        features = Buffer.from(JSON.stringify(features)).toString('base64');
        this.logger.info('json en base64', features);
      }
    );
  }

  fileAdded(file: File) {
    this.logger.info('fileAdded', file);
    this.visor._readSHP(file, {
      type: 'shp',
      name: 'name',
      visible: true,
      topic: 'topic',
      order: 1,
      description: 'description',
      // url: undefined,
      options: {format: 'image/png'},
    });
  }
}
