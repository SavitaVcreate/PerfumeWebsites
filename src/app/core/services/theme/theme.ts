import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Theme {

  private darkMode = new BehaviorSubject<boolean>(false);

  isDarkMode$ = this.darkMode.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      this.enableDarkMode();
    }
  }

  toggleTheme() {
    if (document.body.classList.contains('dark-theme')) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  enableDarkMode() {
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
    this.darkMode.next(true);
  }

  disableDarkMode() {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
    this.darkMode.next(false);
  }
}