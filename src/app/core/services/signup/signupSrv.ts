import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Register } from '../../models/Classes';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class signupService {
   private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  register(data: Register): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }
// private apiUrl = `${environment.apiUrl}/auth`;
//   constructor(private http: HttpClient) {}

//   register(data: Register): Observable<any> {
//     return this.http.post(`${this.apiUrl}/register`, data);
//   }
}
