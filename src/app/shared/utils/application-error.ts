import {Observable} from 'rxjs';

import * as _ from 'lodash';

export class AttrError {
  attr: string;
  errors: Observable<string>[];

  constructor(attr: string, errores: Observable<string>[]) {
    this.attr = attr;
    this.errors = errores;
  }
}

export class ApplicationError extends Error {
  code: number;
  message$: Observable<string>;
  attrs: AttrError[];

  /**
   * Constructor
   * @param code Codigo de error
   * @param message$ Mensaje de error
   * @param attrs Lista de errores de atributo
   */
  constructor(code: number, message$?: Observable<string>, attrs?: AttrError[]) {
    super();

    this.code = code || 10000;
    if (message$) {
      this.message$ = message$;
    }
    this.attrs = attrs || [];
  }

  setMessage(message$: Observable<string>) {
    this.message$ = message$;
  }

  /**
   * Obtiene un error de campo específico por el nombre de
   * atributo
   * @param nombreAtributo Nombre del campo que identifica el AttrError
   */
  getAtributo(nombreAtributo: string): AttrError {
    return _.find(this.attrs, {attr: nombreAtributo}) as AttrError;
  }

  /**
   * Utilidad para actualizar e instanciar AttrError
   * de forma simplificada
   * @param attrName
   * @param errores
   */
  addAttr(attrName: string, errores: Observable<string>[]) {
    const errorAttr: AttrError = this.getAtributo(attrName);
    if (errorAttr) {
      errorAttr.errors = errores;
    } else {
      this.attrs.push(new AttrError(attrName, errores));
    }
  }
}
