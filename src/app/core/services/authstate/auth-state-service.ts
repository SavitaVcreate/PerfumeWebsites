import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private highlightSource = new BehaviorSubject<boolean>(false);
  highlightLogin$ = this.highlightSource.asObservable();
  highlightLogin() {
    this.highlightSource.next(true);
    setTimeout(() => { this.highlightSource.next(false); }, 3000);
  }
}