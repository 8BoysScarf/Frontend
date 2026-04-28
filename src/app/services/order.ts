import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

export interface OrderItemDTO {
  productId: number;
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
  shippingPrice: number;
  customerId?: string;
  customerName?: string;
  customerProfile?: string;
  items: OrderItemDTO[];
}

export interface OrderSummaryDTO {
  id: number;
  totalAmount: number;
  status: string;
  shippingPrice: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
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

  // Admin Endpoints
  getAllOrders(page: number = 1, pageSize: number = 20, status?: string): Observable<PagedResult<OrderSummaryDTO>> {
    let url = `${this.baseUrl}?page=${page}&pageSize=${pageSize}`;
    if (status) url += `&status=${status}`;
    return this.http.get<PagedResult<OrderSummaryDTO>>(url, this.getHeaders());
  }

  updateOrderStatus(id: number, status: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/status`, status, this.getHeaders());
  }
}
