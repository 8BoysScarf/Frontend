import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { DashboardComponent } from './pages/admin/dashboard/dashboard';
import { adminGuard } from './guards/admin.guard';
import { customerGuard } from './guards/customer.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [customerGuard] },
  { path: 'login', component: LoginComponent, canActivate: [customerGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [customerGuard] },
  { path: 'admin', component: DashboardComponent, canActivate: [adminGuard] },
  { path: 'addresses', loadComponent: () => import('./pages/addresses/addresses').then(m => m.AddressesComponent), canActivate: [authGuard, customerGuard] },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart').then(m => m.CartComponent), canActivate: [authGuard, customerGuard] },
  { path: 'wishlist', loadComponent: () => import('./pages/wishlist/wishlist').then(m => m.WishlistComponent), canActivate: [authGuard, customerGuard] },
  { path: 'orders', loadComponent: () => import('./pages/orders/orders').then(m => m.OrdersComponent), canActivate: [authGuard, customerGuard] },
  { path: 'order/:id', loadComponent: () => import('./pages/order-details/order-details').then(m => m.OrderDetailsComponent), canActivate: [authGuard, customerGuard] },
  { path: 'product/:id', loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetailComponent) },
  { path: '**', redirectTo: '' }
];
