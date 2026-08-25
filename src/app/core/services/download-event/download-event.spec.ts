import { TestBed } from '@angular/core/testing';

import { DownloadEvent } from './download-event';

describe('DownloadEvent', () => {
  let service: DownloadEvent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadEvent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
