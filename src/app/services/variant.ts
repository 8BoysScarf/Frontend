import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AddVariantDTO {
  productId: number;
  colorId?: number;
  colorName?: string;
  hexCode?: string;
  size: string;
  realPrice: number;
  price: number;
  discount?: number;
  stockQuantity: number;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class VariantService {
  private http = inject(HttpClient);
  private baseUrl = 'https://8boysscarf.runasp.net/api/ProductVariant';

  getVariant(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addVariant(formData: FormData): Observable<any> {
    return this.http.post(this.baseUrl, formData);
  }

  deleteVariant(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  updateVariant(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, formData);
  }
}
