import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Badge {
  id: number;
  name: string;
}

export interface AddBadgeDTO {
  name: string;
}

export interface UpdateBadgeDTO {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class BadgeService {
  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:7264/api/Badge';

  getBadges(): Observable<Badge[]> {
    return this.http.get<Badge[]>(this.baseUrl);
  }

  addBadge(dto: AddBadgeDTO): Observable<any> {
    return this.http.post(this.baseUrl, dto);
  }

  updateBadge(id: number, dto: UpdateBadgeDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, dto);
  }

  deleteBadge(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
