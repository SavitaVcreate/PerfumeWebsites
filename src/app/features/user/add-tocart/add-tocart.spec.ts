import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTocart } from './add-tocart';

describe('AddTocart', () => {
  let component: AddTocart;
  let fixture: ComponentFixture<AddTocart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTocart],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTocart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
