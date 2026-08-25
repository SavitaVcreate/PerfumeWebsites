import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { homeRedirectGuard } from '../../core/guards/home-redirect/home-redirect-guard';

export const USER_ROUTES: Routes = [
  {
    path: '',
        canActivate: [homeRedirectGuard],

    loadComponent: () =>
      import('./home/home').then(c => c.Home)
  },
    {
    path: 'wishlist',
     canActivate: [authGuard],
    loadComponent: () =>
      import('./wishlist/wishlist').then(c => c.Wishlist)
  },
    {
    path: 'product-details/:id',
    canActivate:[authGuard],
    loadComponent: () =>
      import('./productdetail/productdetail').then(c => c.Productdetail)
  },
    {
    path: 'all-product',
    loadComponent: () =>
      import('./allproductlist/allproductlist').then(c => c.Allproductlist)
  },
   {
    path: 'add-cart',
    canActivate:[authGuard],
    loadComponent: () =>
      import('./add-tocart/add-tocart').then(c => c.AddTocart)
  },
  {
    path:'stores',
    canActivate:[authGuard],
    loadComponent:()=>import('./stores/stores').then(c=>c.Stores)
  },
  {
    path:'about-us',
    canActivate:[authGuard],
    loadComponent:()=>import('./about-us/about-us').then(c=>c.AboutUs)
  },
  {
    path:'buy-now',
    canActivate:[authGuard],
    loadComponent:()=>import('./buy-now/buy-now').then(c=>c.BuyNow)
  },
  {
    path:'payment',
    canActivate:[authGuard],
    loadComponent:()=>import('./payment/payment').then(c=>c.Payment)
  },
  {
    path:'notification',
    // canActivate:[authGuard],
    loadComponent:()=>import('./notification/notification').then(c=>c.Notification)
  },
{
  path:'view',
  loadComponent:()=>import('./recentlyviewproduct/recentlyviewproduct').then(c=>c.Recentlyviewproduct)
},
{
  path:'order',
  loadComponent:()=>import('./order/order').then(c=>c.Order)
},
{
  path:'confirm-order',
  loadComponent:()=>import('./confirmorder/confirmorder').then(c=>c.Confirmorder)
},
{
  path: 'order-details/:id',
  loadComponent: () =>import('./orderdetails/orderdetails').then(c => c.Orderdetails)
},
{
  path: 'cancel-order/:id', loadComponent: () => import('./cancelorder/cancelorder').then(c => c.Cancelorder)
},
{
  path:'contact-us',
  loadComponent:()=>import('./contactus/contactus').then(c=>c.Contactus)
},
{
  path:'write-review',
  loadComponent:()=>import('./reviews/reviews').then(c=>c.Reviews)
},
{
  path:'privacy-policy',
  loadComponent:()=>import('./privacy policy/privacypolicy/privacypolicy').then(c=>c.Privacypolicy)
},
{
  path:'refund-policy',
  loadComponent:()=>import('./privacy policy/refundPolicy/refund-policy/refund-policy').then(c=>c.RefundPolicy)
},
{
  path:'shipping-policy',
  loadComponent:()=>import('./privacy policy/shippingPolicy/shippingpolicy/shippingpolicy').then(c=>c.Shippingpolicy)
},
{
  path:'terms',
  loadComponent:()=>import('./privacy policy/termsAndConditions/terms/terms').then(c=>c.Terms)
}
];