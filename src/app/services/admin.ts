import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

export interface AdminUserDTO {
  id: string;
  userName: string;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = 'https://8boysscarf.runasp.net/api/Admin';

  private getHeaders() {
    const user = this.authService.currentUser();
    return { 'Authorization': `Bearer ${user?.token}` };
  }

  getUsers(): Observable<AdminUserDTO[]> {
    return this.http.get<AdminUserDTO[]>(`${this.baseUrl}/users`, { headers: this.getHeaders() });
  }

  changeRole(id: string, role: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}/role?role=${role}`, {}, { headers: this.getHeaders() });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`, { headers: this.getHeaders() });
  }
}
