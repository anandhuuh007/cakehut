import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'products', loadComponent: () => import('./pages/products/products').then(m => m.Products) },
  { path: 'products/:id', loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetail) },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart').then(m => m.Cart) },
  { path: 'checkout', loadComponent: () => import('./pages/checkout/checkout').then(m => m.Checkout) },
  { path: 'auth', loadComponent: () => import('./pages/auth/auth').then(m => m.Auth) },
  { path: 'orders', loadComponent: () => import('./pages/orders/orders').then(m => m.Orders) },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin').then(m => m.Admin) },
  { path: '**', redirectTo: '' }
];
