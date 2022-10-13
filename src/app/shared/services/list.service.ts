import {Injectable} from '@angular/core';

import {NGXLogger} from 'ngx-logger';

import {Paginator} from '@shared/interfaces';

@Injectable()
export class ListService {
  constructor(private logger: NGXLogger) {}

  deleteItem(
    modelId: number,
    list: any[],
    paginator: Paginator,
    reloadCurrentPageCB?: () => void,
    reloadPreviousPageCB?: () => void
  ) {
    if (paginator.currentPage === paginator.lastPage) {
      // La pagina actual es la ultima pagina del listado

      if (list.length === 1 && paginator.currentPage > 1) {
        // En la pagina actual solo queda el registro que se esta borrando y
        // la pagina actual no es la primera pagina, recarga la anterior
        // pagina
        if (reloadPreviousPageCB) {
          reloadPreviousPageCB();
        }
      } else {
        // En la pagina actual todavia quedan mas registros o no quedan mas
        // registros pero es la primera pagina
        const pos = list.findIndex((item) => item.id == modelId);
        if (pos !== -1) {
          list.splice(pos, 1);
        } else {
          console.warn(
            `No se encontro el registro "${modelId}" que se desea borrar de la lista`
          );
        }
      }
    } else {
      // La pagina actual NO es la ultima pagina del listado
      if (reloadCurrentPageCB) {
        reloadCurrentPageCB();
      }
    }
  }
}
