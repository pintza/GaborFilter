import { TestBed, inject } from '@angular/core/testing';

import { ActionDeciderServiceService } from './actiondeciderservice.service';

describe('ActionDeciderServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActionDeciderServiceService]
    });
  });

  it('should be created', inject([ActionDeciderServiceService], (service: ActionDeciderServiceService) => {
    expect(service).toBeTruthy();
  }));
});
