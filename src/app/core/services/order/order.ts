import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  // api = 'http://localhost:5000/api/order';
  private api = `${environment.apiUrl}/order`;
  constructor(private http: HttpClient) { }

  getOrderCount(): Observable<any> {
    return this.http.get(`${this.api}/count`);
  }

  getOrders(userId: string): Observable<any> {
    return this.http.get(`${this.api}/all-orders/${userId}`);
  }

  getOrderDetails(id: string): Observable<any> {
    return this.http.get(`${this.api}/details/${id}`);
  }
  cancelOrder(id: string, data: any): Observable<any> {
    return this.http.put(`${this.api}/cancel-order/${id}`, data);
  }
  getAdminOrders() {
    return this.http.get(`${this.api}/admin-orders`);
  }
  deleteOrder(orderId: string) {
    return this.http.delete(`${this.api}/delete-order/${orderId}`);
  }
  getRecentOrders() {
    return this.http.get(`${this.api}/recent-orders`)
  }

  updateOrderStatus(orderId: string, orderStatus: string, comment: string = ''): Observable<any> {
    return this.http.put(`${this.api}/admin/orders/${orderId}/status`, { orderStatus: orderStatus, comment: comment });
  }
}


