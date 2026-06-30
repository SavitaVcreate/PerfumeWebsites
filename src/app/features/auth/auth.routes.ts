import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
   {
    path: 'signup',
    loadComponent: () =>
      import('./signup/signup').then(c=>c.Signup)
      // import('./signup/login').then(c => c.Login)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login').then(c => c.Login)
  }
];