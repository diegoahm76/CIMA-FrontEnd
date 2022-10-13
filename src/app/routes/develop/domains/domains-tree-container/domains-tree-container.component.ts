import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {ModalDirective} from 'ngx-bootstrap/modal';
import {NGXLogger} from 'ngx-logger';

import {ApiService, StaticSelectOptionsService} from '@shared/services';
import {TreeService} from '../shared/services';
import {ModalOptions, StaticSelectOptionsState} from '@shared/utils';
import {TreeState, TreeUtil} from '../shared/utils';
import {TreeComponent} from '@shared/components';
import {DomainsFiltersContainerComponent} from './domains-filters-container/domains-filters-container.component';
import {StoreStatus} from '@shared/enums';
import {DevelopDomainTypeValues} from '@app/routes/shared/enums';
import {DevelopDomainModel} from '@app/routes/shared/models';

@Component({
  templateUrl: './domains-tree-container.component.html',
  styleUrls: ['./domains-tree-container.component.scss'],
})
export class DomainsTreeContainerComponent implements OnDestroy, OnInit {
  @ViewChild('modal', {static: true}) modal: ModalDirective;
  @ViewChild('filters', {static: true})
  filtersComponent: DomainsFiltersContainerComponent;
  @ViewChild('tree', {static: true}) tree: TreeComponent;

  private unsubscribe = new Subject<void>();

  modalOptions: ModalOptions;
  selectedModel: DevelopDomainModel;

  selectedParentModel: DevelopDomainModel;
  selectedLevel: number;

  currentUrlParams: HttpParams;

  treeUtil: TreeUtil;
  treeState$: Observable<TreeState>;
  currentModel: DevelopDomainModel;
  maxLevels: number;

  // Selects
  typesState$: Observable<StaticSelectOptionsState>;

  constructor(
    private staticSelectOptionsService: StaticSelectOptionsService,
    // @TODO: eduardo
    // private cachingService: CachingService,
    private apiService: ApiService,
    private treeService: TreeService,
    private logger: NGXLogger
  ) {
    this.modalOptions = new ModalOptions();
  }

  ngOnInit() {
    this.initTreeOptions();
    this.initServices();
    this.initSubscriptions();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private initTreeOptions() {
    this.maxLevels = 2;
  }

  private initServices() {
    this.treeUtil = this.treeService.getInstance('tree');
    this.treeState$ = this.treeUtil.getState();
    this.treeUtil.next({
      status: StoreStatus.INITIATED,
    });

    const typesUtil = this.staticSelectOptionsService.getInstance('types');
    this.typesState$ = typesUtil.getState();
    typesUtil.next({
      list: Object.entries(DevelopDomainTypeValues).map(
        ([value, label]: [string, string]) => {
          return {value, label};
        }
      ),
    });
  }

  private initSubscriptions() {
    this.treeState$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((treeState: TreeState) => {
        if (treeState.status === StoreStatus.OK) {
          if (treeState.list.length) {
            let initialStatus: string;
            if (this.maxLevels) {
              initialStatus =
                treeState.level + 1 >= this.maxLevels ? 'file' : 'ind';
            } else {
              initialStatus = 'ind';
            }
            treeState.list.forEach((model: DevelopDomainModel) => {
              model._treeStatus = initialStatus;
            });
          }

          if (treeState.parentModel) {
            if (treeState.list.length) {
              treeState.parentModel._treeChildren = treeState.list;
              treeState.parentModel._treeStatus = 'folder';
            } else {
              treeState.parentModel._treeStatus = 'file';
            }
          }
        }
      });
  }

  search(urlParams: HttpParams) {
    this.currentUrlParams = urlParams;

    this.currentModel = null;
    this.treeUtil.next({
      status: StoreStatus.INITIATED,
    });
    this.treeUtil.next({
      urlParams: urlParams.set('parentId', 'root'),
      level: 0,
    });
  }

  onSelectModel({model, level}: {model: any; level: number}) {
    this.treeUtil.next({
      urlParams: new HttpParams({
        fromObject: {
          type: this.currentUrlParams.get('type'),
          parentId: model.strId,
          order: this.currentUrlParams.get('order'),
          page: '1',
          pageSize: this.currentUrlParams.get('pageSize'),
        },
      }),
      parentModel: model,
      level: level + 1,
    });
  }

  showForm(data: {
    parentModel: DevelopDomainModel;
    level?: number;
    model?: DevelopDomainModel;
  }) {
    this.selectedParentModel = data.parentModel;
    this.selectedLevel = data.level;
    this.selectedModel = data.model;
    this.modalOptions.modal = 'dominio-form';
    this.modal.show();
  }

  onModelCreated({
    parentModel,
    level,
    model,
  }: {
    parentModel: DevelopDomainModel;
    level: number;
    model: DevelopDomainModel;
  }) {
    // Agrega el nuevo modelo en el componente de arbol
    this.tree.unshiftModel(model, parentModel, level);
    // Selecciona el nuevo modelo creado
    this.tree.selectNode({level, model});
  }

  onModelUpdated({
    parentModel,
    model,
    oldModel,
  }: {
    parentModel: DevelopDomainModel;
    model: DevelopDomainModel;
    oldModel: DevelopDomainModel;
  }) {
    // Transfiere las propiedades de permisos y de arbol del modelo viejo al nuevo
    model._permissions = this.currentModel._permissions;
    model._treeKind = this.currentModel._treeKind;
    model._treeChildren = this.currentModel._treeChildren;
    model._treeStatus = this.currentModel._treeStatus;

    // Actualiza el modelo en el componente de arbol
    this.tree.updateCurrentModel(model, parentModel);
  }

  confirmModelDeletion(model: DevelopDomainModel) {
    this.selectedModel = model;
    this.modalOptions.modal = 'delete-domain';
    this.modal.show();
  }

  onDeletedModel() {
    // Borra el modelo en el componente de arbol
    this.tree.deleteCurrentModel();
  }
}
