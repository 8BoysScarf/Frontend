import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductImageDTO {
  id: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductImageService {
  private http = inject(HttpClient);
  private baseUrl = 'https://8boysscarf.runasp.net/api/ProductImage';

  getAllImages(): Observable<ProductImageDTO[]> {
    return this.http.get<ProductImageDTO[]>(this.baseUrl);
  }
}
