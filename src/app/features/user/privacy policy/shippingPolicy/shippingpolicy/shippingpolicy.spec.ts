import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shippingpolicy } from './shippingpolicy';

describe('Shippingpolicy', () => {
  let component: Shippingpolicy;
  let fixture: ComponentFixture<Shippingpolicy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shippingpolicy],
    }).compileComponents();

    fixture = TestBed.createComponent(Shippingpolicy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
