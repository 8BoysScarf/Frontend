import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = 'https://8boysscarf.runasp.net/api/Wishlist';

  wishlistProductIds = signal<number[]>([]);

  constructor() {
    if (this.authService.currentUser()) {
      this.getWishlist().subscribe();
    }
  }

  private getHeaders() {
    const user = this.authService.currentUser();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${user?.token}`
      })
    };
  }

  getWishlist(): Observable<number[]> {
    return this.http.get<number[]>(this.baseUrl, this.getHeaders()).pipe(
      tap(ids => this.wishlistProductIds.set(ids || [])),
      catchError(err => {
        console.error('Failed to load wishlist', err);
        return of([]);
      })
    );
  }

  addToWishlist(productId: number): Observable<any> {
    // Using null body instead of {} as the backend might not expect a body for a route-parameterized POST
    return this.http.post(`${this.baseUrl}/${productId}`, null, this.getHeaders()).pipe(
      tap(() => {
        this.wishlistProductIds.update(ids => [...ids, productId]);
      }),
      catchError(err => {
        console.error('Failed to add to wishlist', err);
        throw err;
      })
    );
  }

  removeFromWishlist(productId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${productId}`, this.getHeaders()).pipe(
      tap(() => {
        this.wishlistProductIds.update(ids => ids.filter(id => id !== productId));
      }),
      catchError(err => {
        console.error('Failed to remove from wishlist', err);
        throw err;
      })
    );
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistProductIds().includes(productId);
  }

  toggleWishlist(productId: number): Observable<any> {
    if (this.isInWishlist(productId)) {
      return this.removeFromWishlist(productId);
    } else {
      return this.addToWishlist(productId);
    }
  }
}
