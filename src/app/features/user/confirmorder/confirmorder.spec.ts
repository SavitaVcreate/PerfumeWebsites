import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Confirmorder } from './confirmorder';

describe('Confirmorder', () => {
  let component: Confirmorder;
  let fixture: ComponentFixture<Confirmorder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Confirmorder],
    }).compileComponents();

    fixture = TestBed.createComponent(Confirmorder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
