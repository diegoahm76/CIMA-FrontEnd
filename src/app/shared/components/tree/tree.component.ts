import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {NGXLogger} from 'ngx-logger';

// @TODO: revisar este import que esta apuntando a "develop". Deberia
// apuntar a una ruta mas generica.
import {TreeState} from '@app/routes/develop/domains/shared/utils';
import {StoreStatus} from '@shared/enums';

// @TODO
// const ITEM_STATUS_IND = 'ind'; // indeterminado
// const ITEM_STATUS_LOADING = 'loading';
// const ITEM_STATUS_FILE = 'file';
// const ITEM_STATUS_FOLDER = 'folder';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./finderjs.css', './tree.component.scss'],
})
export class TreeComponent implements OnInit, OnDestroy {
  @Input()
  state$: Observable<any>;
  @Input()
  currentModel: any;
  @Input()
  maxLevels?: number;
  @Input()
  maxItemsPerLevel?: number;
  @Input()
  levelLabels?: string[];
  @Output()
  selectModel: EventEmitter<{model: any; level: number}>;
  @Output()
  newNodeClick: EventEmitter<{level: number; parentModel: any}>;
  @Output()
  currentModelChange: EventEmitter<any>;

  private unsubscribe = new Subject<void>();

  breadcrumbs: {
    label: string;
    parentModel: any;
  }[];
  currentLevel: number;

  storeStatus = StoreStatus;

  constructor(private logger: NGXLogger) {
    this.selectModel = new EventEmitter<{model: any; level: number}>();
    this.newNodeClick = new EventEmitter<{level: number; parentModel: any}>();
    this.currentModelChange = new EventEmitter<number>();
  }

  ngOnInit() {
    this.breadcrumbs = [];
    this.initSubscriptions();
  }

  ngOnDestroy() {
    this.selectModel = null;
    this.newNodeClick = null;
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private initSubscriptions() {
    this.state$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((treeState: any) => {
        if (treeState.status === StoreStatus.INITIATED) {
          this.breadcrumbs = [];
          this.currentModel = null;
          this.currentLevel = null;
        } else if (treeState.status === StoreStatus.OK) {
          let maxLevel: number;

          if (
            !treeState.list.length &&
            !this.currentModel &&
            !treeState.parentModel
          ) {
            maxLevel = 0;
            let label: string;
            if (this.levelLabels && this.levelLabels[maxLevel]) {
              label = this.levelLabels[maxLevel];
            } else {
              label = `Nivel ${maxLevel + 1}`;
            }
            this.breadcrumbs[maxLevel] = {
              label,
              parentModel: treeState.parentModel || {
                _treeChildren: treeState.list,
                _treeStatus: 'folder',
              },
            };
          } else if (
            treeState.list.length &&
            ((this.currentModel &&
              treeState.parentModel &&
              treeState.parentModel._treeKind === this.currentModel._treeKind &&
              treeState.parentModel.strId === this.currentModel.strId) ||
              (!this.currentModel && !treeState.parentModel))
          ) {
            maxLevel = this.breadcrumbs.length;
            let label: string;
            if (this.levelLabels && this.levelLabels[maxLevel]) {
              label = this.levelLabels[maxLevel];
            } else {
              label = `Nivel ${maxLevel + 1}`;
            }
            this.breadcrumbs[maxLevel] = {
              label,
              parentModel: treeState.parentModel || {
                _treeChildren: treeState.list,
                _treeStatus: 'folder',
              },
            };
          }
        }
      });
  }

  selectNode({level, model}: {level: number; model: any}) {
    if (model._treeStatus === 'loading') {
      return;
    }

    const maxLevel = this.breadcrumbs.length - 1;
    if (model._treeStatus === 'folder') {
      if (level === maxLevel) {
        let label: string;
        if (this.levelLabels && this.levelLabels[level + 1]) {
          label = this.levelLabels[level + 1];
        } else {
          label = `Nivel ${level + 2}`;
        }
        this.breadcrumbs[maxLevel + 1] = {
          label,
          parentModel: model,
        };
      } else if (level < maxLevel) {
        this.breadcrumbs.splice(level + 2);

        let label: string;
        if (this.levelLabels && this.levelLabels[level + 1]) {
          label = this.levelLabels[level + 1];
        } else {
          label = `Nivel ${level + 2}`;
        }
        this.breadcrumbs[level + 1] = {
          label,
          parentModel: model,
        };
      }

      this.currentModel = model;
      this.currentModelChange.emit(this.currentModel);
      this.currentLevel = level;
    } else {
      if (level < maxLevel) {
        this.breadcrumbs.splice(level + 1);
      }

      this.currentModel = model;
      this.currentModelChange.emit(this.currentModel);
      this.currentLevel = level;

      if (model._treeStatus === 'ind') {
        model._treeStatus = 'loading';

        this.selectModel.emit({model, level: this.currentLevel});
      }
    }
  }

  itemClass(level: number, model: any) {
    let itemClass: string;
    if (
      this.currentModel &&
      model._treeKind === this.currentModel._treeKind &&
      model.strId === this.currentModel.strId
    ) {
      itemClass = 'fjs-main-active';
    } else if (
      this.breadcrumbs[level + 1] &&
      model.strId === this.breadcrumbs[level + 1].parentModel.strId
    ) {
      itemClass = 'fjs-active';
    }
    return itemClass;
  }

  itemIconClass(model: any) {
    let iconClass: string;
    if (model._treeStatus === 'folder') {
      iconClass = 'fas fa-folder';
    } else if (model._treeStatus === 'file') {
      if (model._treeKind === 'IndicadorEstructuraModel' && model.indicadorId) {
        iconClass = 'fas fa-chart-line';
      } else {
        iconClass = 'far fa-file';
      }
    } else if (model._treeStatus === 'loading') {
      iconClass = 'fas fa-spinner fa-spin';
    } else {
      iconClass = 'fas fa-asterisk';
    }
    return iconClass;
  }

  getCurrentParentModel() {
    return this.breadcrumbs[this.currentLevel].parentModel;
  }

  getCurrentLevel() {
    return this.currentLevel;
  }

  unshiftModel(model: any, parentModel: any, level: number) {
    model._treeStatus = 'file';
    if (parentModel._treeStatus !== 'folder') {
      parentModel._treeStatus = 'folder';
      this.selectNode({level: level - 1, model: parentModel});
    }
    if (!Array.isArray(parentModel._treeChildren)) {
      parentModel._treeChildren = [];
    }
    parentModel._treeChildren.unshift(model);
  }

  updateCurrentModel(updatedModel: any, parentModel: any) {
    const pos = parentModel._treeChildren.findIndex((model: any) => {
      return model.strId === updatedModel.strId;
    });
    if (pos !== -1) {
      // Actualiza el modelo en la lista de hijos del modelo padre
      parentModel._treeChildren[pos] = updatedModel;
      // Selecciona el modelo recien actualizado
      this.currentModel = updatedModel;
      this.currentModelChange.emit(this.currentModel);
    } else {
      this.logger.warn(
        `No se encontro el registro "${updatedModel.strId}" que se desea actualizar en la lista`
      );
    }
  }

  deleteCurrentModel() {
    const parentModel = this.getCurrentParentModel();
    const pos = parentModel._treeChildren.findIndex((model: any) => {
      return model.strId === this.currentModel.strId;
    });
    if (pos !== -1) {
      this.currentLevel -= 1;

      // Borra el model del modelo padre
      parentModel._treeChildren.splice(pos, 1);
      if (!parentModel._treeChildren.length) {
        parentModel._treeStatus = 'file';
        // Quita el ultimo nivel que se muestra en el arbol
        this.breadcrumbs.splice(this.currentLevel + 1);
        if (!this.breadcrumbs.length) {
          const maxLevel = 0;
          let label: string;
          if (this.levelLabels && this.levelLabels[maxLevel]) {
            label = this.levelLabels[maxLevel];
          } else {
            label = `Nivel ${maxLevel + 1}`;
          }
          this.breadcrumbs[maxLevel] = {
            label,
            parentModel: {
              _treeChildren: [],
              _treeStatus: 'folder',
            },
          };
        }
      }
      // Selecciona el modelo padre
      this.currentModel = parentModel.id ? parentModel : null;
      this.currentModelChange.emit(this.currentModel);
    } else {
      this.logger.warn(
        `No se encontro el registro "${this.currentModel.strId}" que se desea borrar en la lista`
      );
    }
  }
}
