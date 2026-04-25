import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const customerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If user is Admin, they should only see the dashboard, not customer pages
  if (authService.isAdmin()) {
    router.navigate(['/admin']);
    return false;
  }

  // Allow guests and customers
  return true;
};
