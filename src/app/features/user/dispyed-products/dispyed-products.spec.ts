import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispyedProducts } from './dispyed-products';

describe('DispyedProducts', () => {
  let component: DispyedProducts;
  let fixture: ComponentFixture<DispyedProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispyedProducts],
    }).compileComponents();

    fixture = TestBed.createComponent(DispyedProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
