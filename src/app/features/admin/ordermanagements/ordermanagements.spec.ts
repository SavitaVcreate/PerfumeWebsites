import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ordermanagements } from './ordermanagements';

describe('Ordermanagements', () => {
  let component: Ordermanagements;
  let fixture: ComponentFixture<Ordermanagements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ordermanagements],
    }).compileComponents();

    fixture = TestBed.createComponent(Ordermanagements);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
