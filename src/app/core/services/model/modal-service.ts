import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSource = new BehaviorSubject<any>(null);
  modalState$ = this.modalSource.asObservable();

  show(data: { title: string; message: string; type?: 'success' | 'error' | 'warning' | 'info'; }) {
    this.modalSource.next(data);
  }

  close() {
    this.modalSource.next(null);
  }
}