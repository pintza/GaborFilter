import { TestBed, inject } from '@angular/core/testing';

import { CanvasHistoryService } from './canvashistory.service';

describe('Canvas.HistoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanvasHistoryService]
    });
  });

  it('should be created', inject([CanvasHistoryService], (service: CanvasHistoryService) => {
    expect(service).toBeTruthy();
  }));
});
