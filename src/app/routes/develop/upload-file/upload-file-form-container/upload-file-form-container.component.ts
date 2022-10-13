import {Component, OnInit} from '@angular/core';
import {Params} from '@angular/router';
import {Observable} from 'rxjs';

import {NGXLogger} from 'ngx-logger';

import {
  SubmitUploadFileService,
  SubmitUploadFileState,
} from '../shared/services';
import {StoreStatus} from '@shared/enums';

@Component({
  templateUrl: './upload-file-form-container.component.html',
})
export class UploadFileFormContainerComponent implements OnInit {
  state$: Observable<SubmitUploadFileState>;

  constructor(
    private submitService: SubmitUploadFileService,
    private logger: NGXLogger
  ) {}

  ngOnInit() {
    this.initServices();
  }

  private initServices() {
    this.state$ = this.submitService.getState();
    this.submitService.next({
      status: StoreStatus.INITIATED,
    });
  }

  submit(data: Params) {
    this.logger.info('submit', data);
  }
}
