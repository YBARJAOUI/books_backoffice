import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyOffers } from './daily-offers';

describe('DailyOffers', () => {
  let component: DailyOffers;
  let fixture: ComponentFixture<DailyOffers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyOffers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyOffers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
