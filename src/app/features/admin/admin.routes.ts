import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin-guard';
import { Admin } from './admin';

export const ADMIN_ROUTES: Routes = [

  {
    path: '',
    component: Admin,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard)
      },
      {
        path: 'order',
        loadComponent: () => import('./ordermanagements/ordermanagements').then(c => c.Ordermanagements)
      },
      {
        path: 'customers',
        loadComponent: () => import('./customers/customers').then(c => c.Customers)
      },
      {
        path: 'add-products',
        loadComponent: () => import('./addproduct/addproduct').then(c => c.Addproduct)
      },
      {
        path: 'admin-profile',
        loadComponent: () => import('./adminprofile/adminprofile').then(c => c.Adminprofile)
      },
      {
        path: 'product-list',
        loadComponent: () => import('./product-list/product-list').then(c => c.ProductList)
      },
      {
        path: 'transaction',
        loadComponent: () => import('./transaction/transaction').then(c => c.Transaction)
      },
      {
        path: 'invoice',
        loadComponent: () => import('./invoice/invoice').then(c => c.Invoice)
      },
      {
        path: 'return-product',
        loadComponent: () => import('./returnproduct/returnproduct').then(c => c.Returnproduct)
      }
    ]
  }
];