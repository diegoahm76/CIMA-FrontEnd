import {Injectable} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {NGXLogger} from 'ngx-logger';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  constructor(private router: Router, private logger: NGXLogger) {}

  updateQueryParams(route: ActivatedRoute, params: Params) {
    // Actualiza los parametros de la url
    const extras = {
      relativeTo: route,
      queryParams: params,
    };
    this.router.navigate(['.'], extras);
  }
}
