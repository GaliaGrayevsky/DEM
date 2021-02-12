import { TestBed } from '@angular/core/testing';

import { SubTestsService } from './sub-tests.service';

describe('SubTestsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubTestsService = TestBed.get(SubTestsService);
    expect(service).toBeTruthy();
  });
});
