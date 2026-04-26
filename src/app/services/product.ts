import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  code: string;
  categoryName: string;
  price: number;
  thumbnailUrl: string;
  badges: string[];
  stockQuantity: number;
  size?: string;
  discount?: number;
  hexCode?: string;
  description?: string;
}

export interface ProductVariant {
  id: number;
  colorId?: number;
  colorName?: string;
  colorHex?: string;
  size: string;
  realPrice: number;
  price: number;
  discount?: number;
  stockQuantity: number;
  code: string;
  imageUrls: string[];
}

export interface ProductDetails {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string;
  badges: string[];
  variants: ProductVariant[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:7264/api/Product';

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getProduct(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  addProduct(formData: FormData): Observable<any> {
    return this.http.post(this.baseUrl, formData);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
