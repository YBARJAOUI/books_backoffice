import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Packs } from './packs';

describe('Packs', () => {
  let component: Packs;
  let fixture: ComponentFixture<Packs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Packs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Packs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
