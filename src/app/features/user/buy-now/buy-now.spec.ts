import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyNow } from './buy-now';

describe('BuyNow', () => {
  let component: BuyNow;
  let fixture: ComponentFixture<BuyNow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyNow],
    }).compileComponents();

    fixture = TestBed.createComponent(BuyNow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
