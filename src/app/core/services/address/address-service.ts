import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private baseUrl = `${environment.apiUrl}/address`;
  // private baseUrl = 'http://localhost:5000/api/address';
  constructor(private http: HttpClient) { }
  private getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  addAddress(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, data, this.getHeaders());
  }
  getAddresses(): Observable<any> {
    return this.http.get(this.baseUrl, this.getHeaders());
  }
  getAddressById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`, this.getHeaders());
  }
  updateAddress(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data, this.getHeaders());
  }
  deleteAddress(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getHeaders());
  }
}