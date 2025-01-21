import { TestBed } from '@angular/core/testing';

import { RequisitionServiceService } from './requisition-service.service';

describe('RequisitionServiceService', () => {
  let service: RequisitionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequisitionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
