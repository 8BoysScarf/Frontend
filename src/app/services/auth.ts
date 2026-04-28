import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'https://8boysscarf.runasp.net/api/Auth';
  
  // Current user signal
  currentUser = signal<any>(this.getUserFromStorage());

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap(response => this.setSession(response))
    );
  }

  private setSession(userData: any) {
    localStorage.setItem('user', JSON.stringify(userData));
    this.currentUser.set(userData);
    
    // Save role explicitly to localStorage
    const roles = userData?.roles || userData?.Roles || [];
    if (roles.includes('Admin')) {
      localStorage.setItem('role', 'Admin');
    } else {
      localStorage.setItem('role', 'Customer');
    }
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.currentUser.set(null);
  }

  hasRole(role: string): boolean {
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem('role');
      if (storedRole && storedRole === role) {
        return true;
      }
    }
    const user = this.currentUser();
    const roles = user?.roles || user?.Roles || [];
    return roles.includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  isCustomer(): boolean {
    // If they are explicitly Customer, or if they are just logged in and not Admin
    const user = this.currentUser();
    if (!user) return false;
    
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem('role');
      if (storedRole) return storedRole === 'Customer';
    }
    return !this.isAdmin();
  }

  private getUserFromStorage() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;

      try {
        const user = JSON.parse(userStr);
        
        // Check for expiration
        if (user.expiresAt) {
          const expiryDate = new Date(user.expiresAt);
          const now = new Date();
          
          if (now >= expiryDate) {
            console.warn('Session expired. Logging out.');
            this.logout();
            return null;
          }
        }
        
        return user;
      } catch (e) {
        console.error('Error parsing user from storage', e);
        this.logout();
        return null;
      }
    }
    return null;
  }
}
