import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { DashboardComponent } from './pages/admin/dashboard/dashboard';
import { adminGuard } from './guards/admin.guard';
import { customerGuard } from './guards/customer.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [customerGuard] },
  { path: 'login', component: LoginComponent, canActivate: [customerGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [customerGuard] },
  { path: 'admin', component: DashboardComponent, canActivate: [adminGuard] },
  { path: 'product/:id', loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetailComponent) },
  { path: '**', redirectTo: '' }
];
