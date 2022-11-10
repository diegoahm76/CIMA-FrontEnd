import {TestBed} from '@angular/core/testing';

import {TypeValuesService} from './type-values.service';

describe('TypeValuesService', () => {
  let service: TypeValuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeValuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
