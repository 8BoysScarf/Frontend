import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

export interface CityShipping {
  id: number;
  city: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `https://8boysscarf.runasp.net/api/Shipping`;

  private getHeaders() {
    const user = this.authService.currentUser();
    return { 'Authorization': `Bearer ${user?.token}` };
  }

  getMyShippingPrice(): Observable<{ shippingPrice: number }> {
    return this.http.get<{ shippingPrice: number }>(`${this.apiUrl}/price`, { headers: this.getHeaders() });
  }

  getAllCityPrices(): Observable<CityShipping[]> {
    return this.http.get<CityShipping[]>(`${this.apiUrl}/cities`, { headers: this.getHeaders() });
  }

  setCityPrice(city: string, price: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/cities`, null, {
      params: { city, price: price.toString() },
      headers: this.getHeaders()
    });
  }

  deleteCity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cities/${id}`, { headers: this.getHeaders() });
  }
}
