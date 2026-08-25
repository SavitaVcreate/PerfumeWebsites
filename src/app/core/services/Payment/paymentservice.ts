import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class Paymentservice {
  private apiUrl = `${environment.apiUrl}/order`;
  constructor(private http: HttpClient) { }
  checkout(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, data);
  }
  verifyPayment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-payment`, data);
  }
  placeCODOrder(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/place-cod-order`, data);
  }
  getAllOrders(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/all-orders/${userId}`);
  }
  getOrderDetails(orderId: string) {
    return this.http.get(`${this.apiUrl}/details/${orderId}`);
  }
  cancelOrder(orderId: string, data: any) {
    return this.http.put(`${this.apiUrl}/cancel-order/${orderId}`, data);
  }
  updateOrderStatus(orderId: string, orderStatus: string) {
    return this.http.put(`${this.apiUrl}/orders/${orderId}/status`, { orderStatus: orderStatus });
  }
}