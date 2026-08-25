import { TestBed } from '@angular/core/testing';

import { WhichlistService } from './whichlist-service';

describe('WhichlistService', () => {
  let service: WhichlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhichlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
