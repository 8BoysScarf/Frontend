import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth';
import { ProductVariant } from './product'; // Corrected import path

export interface CartItem {
  id: number;
  cartId: number;
  productVariantId: number;
  quantity: number;
  // Note: the backend might not return productVariant directly unless included, 
  // but we define it here optionally just in case we can patch it or it gets returned.
  productVariant?: ProductVariant; 
}

export interface Cart {
  id: number;
  userId: string;
  items: CartItem[];
}

export interface AddToCartDTO {
  productVariantId: number;
  quantity: number;
}

export interface CheckoutDTO {
  addressId: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = 'https://localhost:7264/api/Cart';

  cartItemCount = signal<number>(0);

  constructor() {
    // Initial load if user is logged in
    if (this.authService.currentUser()) {
      this.getCart().subscribe();
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

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.baseUrl, this.getHeaders()).pipe(
      tap(cart => {
        const count = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
        this.cartItemCount.set(count);
      })
    );
  }

  addItem(dto: AddToCartDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/items`, dto, this.getHeaders()).pipe(
      tap(() => this.getCart().subscribe())
    );
  }

  removeItem(variantId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/items/${variantId}`, this.getHeaders()).pipe(
      tap(() => this.getCart().subscribe())
    );
  }

  checkout(dto: CheckoutDTO): Observable<{ orderId: number }> {
    return this.http.post<{ orderId: number }>(`${this.baseUrl}/checkout`, dto, this.getHeaders()).pipe(
      tap(() => this.cartItemCount.set(0))
    );
  }
}
