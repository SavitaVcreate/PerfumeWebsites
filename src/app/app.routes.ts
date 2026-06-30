import { Routes } from '@angular/router';

export const routes: Routes = [

//   {
//     path: '',
//     loadChildren: () =>
//       import('./features/user/user.routes')
//         .then(m => m.USER_ROUTES)
//   },
 {
    path: '',
    loadChildren: () =>
      import('./features/user/user.routes')
        .then(m => m.USER_ROUTES)
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes')
        .then(m => m.ADMIN_ROUTES)
  },

  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes')
        .then(m => m.AUTH_ROUTES)
  },

  {
    path: '**',
    redirectTo: ''
  }


];
