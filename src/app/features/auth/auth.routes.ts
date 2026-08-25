import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
   {
    path: 'signup',
    loadComponent: () => import('./signup/signup').then(c=>c.Signup)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then(c => c.Login)
  },
  {
    path: 'my-profile',
    loadComponent: () => import('./myprofile/myprofile').then(c => c.Myprofile)
  },
  {
    path: 'address',
    loadComponent: () => import('./add-address/add-address').then(c=>c.AddAddress)
  }
];