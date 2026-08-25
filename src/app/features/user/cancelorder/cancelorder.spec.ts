import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cancelorder } from './cancelorder';

describe('Cancelorder', () => {
  let component: Cancelorder;
  let fixture: ComponentFixture<Cancelorder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cancelorder],
    }).compileComponents();

    fixture = TestBed.createComponent(Cancelorder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
