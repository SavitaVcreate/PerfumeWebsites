import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
export type AlertType = | 'success'| 'warning'| 'error'| 'info';
export interface AlertData {
  type: AlertType;
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<AlertData | null>(null);
  alert$ = this.alertSubject.asObservable();
  private timeoutId: any;
  show(type: AlertType, message: string, duration: number = 3000 ): void {
    clearTimeout(this.timeoutId);
    this.alertSubject.next({
      type,
      message
    });
    this.timeoutId = setTimeout(() => {
      this.clear();
    }, duration);
  }
  success(message: string): void {
    this.show('success', message);
  }
  warning(message: string): void {
    this.show('warning', message);
  }
  error(message: string): void {
    this.show('error', message);
  }
  info(message: string): void {
    this.show('info', message);
  }
  clear(): void {
    this.alertSubject.next(null);
  }
}