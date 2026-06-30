import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Validators } from './validators';

describe('Validators', () => {
  let component: Validators;
  let fixture: ComponentFixture<Validators>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Validators],
    }).compileComponents();

    fixture = TestBed.createComponent(Validators);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
