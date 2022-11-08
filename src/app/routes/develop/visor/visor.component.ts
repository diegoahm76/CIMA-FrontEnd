import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Params, Router} from '@angular/router';
import {TreesService} from '@app/api/treesService/trees.service';
import {DevelopUserRoleValues} from '@app/routes/shared/enums';
import {StoreStatus} from '@app/shared/enums';
import {Model} from '@app/shared/models';
import {FormService, StaticSelectOptionsService} from '@app/shared/services';
import {StaticSelectOptionsState} from '@app/shared/utils';
import {TranslateService} from '@ngx-translate/core';
import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';

import {NGXLogger} from 'ngx-logger';
import {Observable} from 'rxjs';
import {dataGeo} from './mockData/geojson';

declare var Visor: any;

@Component({
  templateUrl: './visor.component.html',
  styleUrls: ['./map.css'],
})
export class VisorComponent implements OnInit {
  visor: typeof Visor;
  searchClick: EventEmitter<Params>;
  module: string = '';
  submodule: string = '';
  rolesState: Observable<StaticSelectOptionsState>;
  datesList: Array<Model | {strId: string; _label: string}>;
  scaleList: Array<Model | {strId: string; _label: string}>;
  epicaList: Array<Model | {strId: string; _label: string}>;
  fileTypesList: Array<Model | {strId: string; _label: string}>;
  departamentosList: Array<Model | {strId: string; _label: string}> = [];
  departamentos: string[];
  municipios: string[];
  municipiosList: Array<Model | {strId: string; _label: string}> = [];
  dateFilter: number;
  @Input() params?: Params;
  @Output() newInModalClick: EventEmitter<void>;
  @Output() newClick: EventEmitter<void>;
  @Output() stateIdChange: EventEmitter<string>;
  storeStatus = StoreStatus;
  form: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  colorTheme = 'theme-green';
  dataUrlConstructor: any;
  metricsList: {strId: string; _label: string}[];
  isCollapsed = false;
  isCollapsedOne = true;
  isCollapsedTwo = true;
  isCollapsedThree = true;
  constructor(
    private treeService: TreesService,
    private router: Router,
    private fb: FormBuilder,
    private translate: TranslateService,
    private staticSelectOptionsService: StaticSelectOptionsService,
    private formService: FormService,
    private logger: NGXLogger
  ) {
    this.dataUrlConstructor = this.router.getCurrentNavigation();
    this.searchClick = new EventEmitter<Params>();
    this.newInModalClick = new EventEmitter<void>();
    this.newClick = new EventEmitter<void>();
    this.stateIdChange = new EventEmitter<string>();
  }

  ngOnInit() {
    this.treeService.getTrees(2020).subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {}
    );
    this.module =
      this.dataUrlConstructor.extras.state == undefined
        ? ''
        : this.dataUrlConstructor.extras.state.module;
    this.submodule =
      this.dataUrlConstructor.extras.state == undefined
        ? ''
        : this.dataUrlConstructor.extras.state.submodule;
    const rolesUtil = this.staticSelectOptionsService.getInstance('roles');
    this.rolesState = rolesUtil.getState();
    rolesUtil.next({
      list: Object.entries(DevelopUserRoleValues).map(
        ([value, label]: [string, string]) => {
          return {value, label};
        }
      ),
    });
    this.loadListForDefault();
    this.initForm();
    this.initVisor();
  }

  loadListForDefault() {
    this.metricsList = [
      {
        strId: '0',
        _label: 'Número de árboles sembrados a nivel nacional por año',
      },
      {
        strId: '1',
        _label:
          'Número actualizado del total  de arboles sembrados en el territorio nacional',
      },
      {
        strId: '2',
        _label:
          'Número actualizado del total  de arboles sembrados por Departamento',
      },
      {
        strId: '3',
        _label:
          'Número actualizado del total  de arboles sembrados por region PND',
      },
      {
        strId: '4',
        _label:
          'Número actualizado del total  de arboles sembrados por Autoridad Ambiental',
      },
      {
        strId: '5',
        _label:
          '% de avance de la ejecución presupuestal de proyectos desarrollados por las autoridades ambientales CARs',
      },
      {
        strId: '6',
        _label:
          'Avance porcentual de la meta de árboles a sembrar por CARS  (vigencia  gobierno 2018-2022)',
      },
      {
        strId: '7',
        _label:
          'Proyectos impuesto al carbono  que aportan a la meta de 180 millones de árboles',
      },
    ];
    this.datesList = [
      {strId: '0', _label: 'Mensual'},
      {strId: '1', _label: 'Anual'},
    ];
    this.fileTypesList = [
      {strId: '0', _label: 'SHP'},
      {strId: '1', _label: 'PDF'},
      {strId: '2', _label: 'GIF'},
      {strId: '2', _label: 'JPG'},
    ];
    this.scaleList = [
      {strId: '0', _label: 'Nacional'},
      {strId: '1', _label: 'Departamental'},
      {strId: '2', _label: 'Municipal'},
      {strId: '3', _label: 'Municipios PDET'},
      {strId: '4', _label: 'CAR'},
      {strId: '5', _label: 'PND'},
    ];
    this.epicaList = [
      {strId: '0', _label: 'Certificación'},
      {strId: '1', _label: 'Cuantificación huella de carbono'},
      {strId: '2', _label: 'Inventario de GEI'},
      {strId: '3', _label: 'Planes de reducción de emisiones de GEI'},
      {strId: '4', _label: 'Reporte de GEI'},
      {strId: '5', _label: 'Norma para la certificación'},
    ];

    [
      ...new Set(dataGeo.features.map((item) => item.properties.Departamento)),
    ].forEach((dpto) => {
      this.departamentosList.push({strId: dpto, _label: dpto});
    });
    [
      ...new Set(dataGeo.features.map((item) => item.properties.Municipio)),
    ].forEach((mcpio) => {
      this.municipiosList.push({strId: mcpio, _label: mcpio});
    });
  }

  applyTheme(pop: any) {
    // create new object on each property change
    // so Angular can catch object reference change
    this.bsConfig = Object.assign({}, {containerClass: this.colorTheme});
    setTimeout(() => {
      pop.show();
    });
  }

  private initForm() {
    // Modelo asociado al formulario
    this.form = this.fb.group({
      mtric: [''],
      scale: [''],
      dpto: [''],
      mcpio: [''],
      dateYYYY: [''],
      epica: [''],
      fileTypes: [''],
    });

    if (this.params) {
      // Actualiza el modelo del formulario con los parametros recibidos
      this.formService.resetFormGroup(this.form, this.params);
    }
  }

  private initVisor() {
    const layers = [
      {
        url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}',
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
    // this.visor._loadGeoJson(dataGeo,layers);
  }

  search({value, valid}: {value: {[param: string]: string}; valid: boolean}) {}

  onChangeDateYYYY(event: Date) {
    if (event != null && event != undefined)
      this.dateFilter = event.getFullYear();
  }

  getPointsForFilters() {
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
    let dataGeoCopy = {...dataGeo};

    if (this.form.value.scale == 0 && this.dateFilter != null) {
      dataGeoCopy.features = dataGeo.features.filter(
        (df) => df.properties.Anio == this.dateFilter
      );
    }
    if (this.form.value.scale == 1 && this.dateFilter != null) {
      dataGeoCopy.features = dataGeo.features.filter(
        (df) =>
          df.properties.Anio == this.dateFilter &&
          df.properties.Departamento == this.form.value.dpto
      );
    }
    if (this.form.value.scale == 2 && this.dateFilter != null) {
      dataGeoCopy.features = dataGeo.features.filter(
        (df) =>
          df.properties.Anio == this.dateFilter &&
          df.properties.Municipio == this.form.value.mcpio
      );
    }
    if (this.form.value.scale == 3 && this.dateFilter != null) {
      dataGeoCopy.features = dataGeo.features.filter(
        (df) =>
          df.properties.Anio == this.dateFilter &&
          df.properties.Municipio == this.form.value.mcpio
      );
    }
    if (this.form.value.scale == 4 && this.dateFilter != null) {
      dataGeoCopy.features = dataGeo.features.filter(
        (df) => df.properties.Anio == this.dateFilter
      );
    }
    if (this.form.value.scale == 5 && this.dateFilter != null) {
      dataGeoCopy.features = dataGeo.features.filter(
        (df) => df.properties.Anio == this.dateFilter
      );
    }

    this.visor._loadGeoJson(dataGeoCopy, layers);
  }

  isCollapsedOption(option) {
    this.clearForm();
    switch (option) {
      case 1:
        this.isCollapsedOne = !this.isCollapsedOne;
        break;
      case 2:
        this.isCollapsedTwo = !this.isCollapsedTwo;
        break;
      case 3:
        this.isCollapsedThree = !this.isCollapsedThree;
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        break;
      case 7:
        break;

      default:
        break;
    }
  }

  clearForm() {
    this.form.reset();
  }

  redirectToLink(option) {
    this.router.navigateByUrl(`/${option}`, {
      state: this.dataUrlConstructor.extras.state,
    });
  }

  removeMark() {}

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
