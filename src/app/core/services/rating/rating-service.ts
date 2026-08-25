import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = '${environment.apiUrl}/ratings';

  constructor(private http: HttpClient) { }

  addRating(productId: string, rating: number): Observable<any> {
    return this.http.post(this.apiUrl, { productId, rating });
  }

  getProductRating(productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${productId}`);
  }

  getUserRating(productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${productId}`);
  }
}