import { TestBed } from '@angular/core/testing';

import { MedicalLeaveService } from './medical-leave.service';

describe('MedicalLeaveService', () => {
  let service: MedicalLeaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalLeaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
