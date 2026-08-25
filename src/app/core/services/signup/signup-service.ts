
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }
  get headers() {
    return { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) };
  }

  register(data: any) {
    return this.http.post(this.apiUrl + "/register", data);
  }

  login(data: any) {
    return this.http.post(this.apiUrl + "/login", data);
  }

  getProfile() { return this.http.get(this.apiUrl + "/profile", this.headers); }
  updateProfile(data: FormData) {
    return this.http.put(this.apiUrl + "/profile", data, this.headers);
  }

  deleteProfileImage() {
    return this.http.put(this.apiUrl + "/delete-profile-image", {}, this.headers);
  }
  getAllProfiles(): Observable<any> {
    return this.http.get(this.apiUrl + "/getAllProfiles", this.headers);
  }
}