import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Returnproduct } from './returnproduct';

describe('Returnproduct', () => {
  let component: Returnproduct;
  let fixture: ComponentFixture<Returnproduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Returnproduct],
    }).compileComponents();

    fixture = TestBed.createComponent(Returnproduct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
