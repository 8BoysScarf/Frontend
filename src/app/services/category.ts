import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  parentName?: string;
  parentCategoryId?: number;
}

export interface AddCategoryDTO {
  name: string;
  parentCategoryId?: number;
}

export interface UpdateCategoryDTO {
  id: number;
  name: string;
  parentCategoryId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:7264/api/Category';

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/GetAllNames`);
  }

  addCategory(dto: AddCategoryDTO): Observable<any> {
    return this.http.post(this.baseUrl, dto);
  }

  updateCategory(dto: UpdateCategoryDTO): Observable<any> {
    return this.http.put(this.baseUrl, dto);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
