
// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// export const adminGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//   const token = localStorage.getItem('token');
//   const user = JSON.parse(localStorage.getItem('user') || '{}');
//   if (token && user.role === 'Admin') {
//     return true;
//   }

//   router.navigate(['/auth/login']);
//   return false;
// };
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {

  const router = inject(Router);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (token && user.role === 'Admin') {
    return true;
  }

  return router.createUrlTree(['/auth/login']);

};