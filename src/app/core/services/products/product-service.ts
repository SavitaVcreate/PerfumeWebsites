import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private api = `${environment.apiUrl}/products`;
  constructor(private http: HttpClient) { }

  addProduct(data: FormData) { return this.http.post(this.api, data); }
  
  getProducts() { return this.http.get(this.api); }

  getProduct(id: string) { return this.http.get(`${this.api}/${id}`); }

  updateProduct(id: string, data: FormData) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.api}/${id}`);
  }
}

