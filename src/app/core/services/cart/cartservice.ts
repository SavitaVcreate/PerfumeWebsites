import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class Cartservice {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();
  constructor(private http: HttpClient) { }
  addToCart(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data);
  }
  getCart(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  updateCart(id: string, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { quantity });
  }

  deleteCart(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  clearCart(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear/${userId}`);
  }

  setCartCount(count: number) {
    this.cartCount.next(count);
  }
}