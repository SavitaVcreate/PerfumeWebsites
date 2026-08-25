import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ReturnService {
  private baseUrl = `${environment.apiUrl}/returns`
  constructor(private http: HttpClient) { }
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` });
  }
  requestReturn(data: { userId: string; orderId: string; productId: string; quantity: number; reason: string; description: string; }): Observable<any> {
    return this.http.post(`${this.baseUrl}/request`, data, { headers: this.getHeaders() });
  }

  getUserReturns(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}`, { headers: this.getHeaders() });
  }

  getReturnById(returnId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${returnId}`, { headers: this.getHeaders() });
  }
  getAllReturns(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/all`, { headers: this.getHeaders() });
  }
  approveReturn(returnId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/${returnId}/approve`, {}, { headers: this.getHeaders() });
  }

  rejectReturn(returnId: string, data?: { reason?: string; comment?: string; }): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/${returnId}/reject`, data || {}, { headers: this.getHeaders() });
  }
  markReturnPickedUp(returnId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/${returnId}/picked-up`, {}, { headers: this.getHeaders() });
  }

  markReturned(returnId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/${returnId}/returned`, {}, { headers: this.getHeaders() });
  }
  processRefund(returnId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/${returnId}/refund-processing`, {}, { headers: this.getHeaders() });
  }
  completeRefund(returnId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/${returnId}/refund-completed`, {}, { headers: this.getHeaders() });
  }
}