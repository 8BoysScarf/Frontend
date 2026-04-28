import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

export interface ReviewDTO {
  id: number;
  userId: string;
  userPhotoUrl?: string;
  userName?: string;
  rating: number;
  comment: string;
  productId: number;
  productName?: string;
}

export interface AddReviewDTO {
  productId: number;
  productVariantId?: number;
  rating: number;
  comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = 'https://8boysscarf.runasp.net/api/Review';

  addReview(dto: AddReviewDTO): Observable<any> {
    const user = this.authService.currentUser();
    const headers = { 'Authorization': `Bearer ${user?.token}` };
    return this.http.post(this.baseUrl, dto, { headers });
  }

  getReviews(productId?: number): Observable<ReviewDTO[]> {
    const user = this.authService.currentUser();
    const headers = { 'Authorization': `Bearer ${user?.token}` };
    const url = productId ? `${this.baseUrl}?productId=${productId}` : this.baseUrl;
    return this.http.get<ReviewDTO[]>(url, { headers });
  }

  deleteReview(id: number): Observable<any> {
    const user = this.authService.currentUser();
    const headers = { 'Authorization': `Bearer ${user?.token}` };
    return this.http.delete(`${this.baseUrl}/${id}`, { headers });
  }
}
