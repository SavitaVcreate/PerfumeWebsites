import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class WhichlistService {
  private apiUrl = `${environment.apiUrl}/wishlist`;
  private wishlistCount = new BehaviorSubject<number>(0);
  wishlistCount$ = this.wishlistCount.asObservable();

  constructor(private http: HttpClient) { }
  
  private getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  setWishlistCount(count: number) { this.wishlistCount.next(count); }

  getCurrentWishlistCount() { return this.wishlistCount.value; }

  addToWishlist(productId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { productId }, this.getHeaders());
  }

  getWishlist(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  removeWishlist(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${productId}`, this.getHeaders());
  }
}