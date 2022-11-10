import {TestBed} from '@angular/core/testing';

import {TreesService} from './trees.service';

describe('TreesService', () => {
  let service: TreesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
