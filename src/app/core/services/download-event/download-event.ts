import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadEvent {
  private downloadSubject = new Subject<void>();
  download$ = this.downloadSubject.asObservable();
  triggerDownload() {
    console.log('Service Triggered');
    this.downloadSubject.next();
  }
}