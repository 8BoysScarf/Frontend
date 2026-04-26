import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

export interface Address {
  id: number;
  city: string;
  street: string;
  isDefault: boolean;
}

export interface AddAddressDTO {
  city: string;
  street: string;
  isDefault: boolean;
}

export interface UpdateAddressDTO {
  id: number;
  city: string;
  street: string;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = 'https://localhost:7264/api/Address';

  private getHeaders() {
    const user = this.authService.currentUser();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${user?.token}`
      })
    };
  }

  getAll(): Observable<Address[]> {
    console.log(this.getHeaders());
    return this.http.get<Address[]>(this.baseUrl, this.getHeaders());
  }

  add(dto: AddAddressDTO): Observable<any> {
    return this.http.post(this.baseUrl, dto, this.getHeaders());
  }

  update(id: number, dto: UpdateAddressDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, dto, this.getHeaders());
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getHeaders());
  }

  setDefault(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/default`, {}, this.getHeaders());
  }
}
