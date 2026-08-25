import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const homeRedirectGuard: CanActivateFn = () => {

  const router = inject(Router);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (token && user.role === 'Admin') {
    return router.createUrlTree(['/admin']);
  }

  return true;

};