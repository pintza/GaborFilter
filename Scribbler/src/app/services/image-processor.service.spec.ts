import { TestBed, inject } from '@angular/core/testing';

import { ImageProcessorService } from './image-processor.service';

describe('ImageProcessorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageProcessorService]
    });
  });

  it('should be created', inject([ImageProcessorService], (service: ImageProcessorService) => {
    expect(service).toBeTruthy();
  }));
});
