import { TestBed } from '@angular/core/testing';

import { DailyOffer } from './daily-offer';

describe('DailyOffer', () => {
  let service: DailyOffer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyOffer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
