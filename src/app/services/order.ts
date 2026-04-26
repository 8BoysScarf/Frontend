import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

export interface OrderItemDTO {
  productVariantId: number;
  productName: string;
  variantCode: string;
  quantity: number;
  price: number;
  thumbnail: string;
}

export interface OrderDetailsDTO {
  id: number;
  totalAmount: number;
  status: string;
  items: OrderItemDTO[];
}

export interface OrderSummaryDTO {
  id: number;
  totalAmount: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = 'https://8boysscarf.runasp.net/api/Order';

  private getHeaders() {
    const user = this.authService.currentUser();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${user?.token}`
      })
    };
  }

  createFromCart(addressId: number): Observable<{ orderId: number }> {
    return this.http.post<{ orderId: number }>(`${this.baseUrl}/create-from-cart`, { addressId }, this.getHeaders());
  }

  getMyOrders(): Observable<OrderSummaryDTO[]> {
    return this.http.get<OrderSummaryDTO[]>(`${this.baseUrl}/my-orders`, this.getHeaders());
  }

  getOrderDetails(id: number): Observable<OrderDetailsDTO> {
    return this.http.get<OrderDetailsDTO>(`${this.baseUrl}/${id}`, this.getHeaders());
  }
}
