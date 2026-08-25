import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recentlyviewproduct } from './recentlyviewproduct';

describe('Recentlyviewproduct', () => {
  let component: Recentlyviewproduct;
  let fixture: ComponentFixture<Recentlyviewproduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recentlyviewproduct],
    }).compileComponents();

    fixture = TestBed.createComponent(Recentlyviewproduct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
