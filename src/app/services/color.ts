import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Color {
  id: number;
  name: string;
  hexCode: string;
}

export interface AddColorDTO {
  name: string;
  hexCode: string;
}

export interface UpdateColorDTO {
  id: number;
  name: string;
  hexCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private http = inject(HttpClient);
  private baseUrl = 'https://8boysscarf.runasp.net/api/Color';

  getColors(): Observable<Color[]> {
    return this.http.get<Color[]>(this.baseUrl);
  }

  addColor(dto: AddColorDTO): Observable<any> {
    return this.http.post(this.baseUrl, dto);
  }

  updateColor(id: number, dto: UpdateColorDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, dto);
  }

  deleteColor(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
