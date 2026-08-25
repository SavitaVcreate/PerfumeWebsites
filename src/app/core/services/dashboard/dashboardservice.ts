import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Dashboardservice {
  private apiUrl = `${environment.apiUrl}/dashboard`;
  // http://localhost:5000/api/dashboard/getChart
  constructor(private http: HttpClient) { }
  getDashboard() {
    return this.http.get(this.apiUrl);
  }
  getAllDashboard() {
    return this.http.get(`${this.apiUrl}/getChart`);
  }
  getChartDashboard(type: string, period: string) {
    return this.http.get(
      `${this.apiUrl}/getChart?type=${type}&period=${period}`
    );
  }
  // getChartDashboard(type: string) {
  //   return this.http.get(
  //     `${this.apiUrl}/getChart?type=${type}`
  //   );
  // }
getCustomerDashboard(period: string) {
  return this.http.get(
    `${this.apiUrl}/getCustomerDashboard?period=${period}`
  );
}
  // getCustomerDashboard(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/getCustomerDashboard`);
  // }
  getTranactionDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getTransactionDashboard`);
  }
  getTransaction(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getTransaction`);
  }
  download(module: string, type: string) {
    return this.http.get(
      `${environment.apiUrl}/download/${module}/${type}`,
      {
        responseType: 'blob'
      }
    );
  }
  getUsersLast30Minutes() {
    return this.http.get(`${this.apiUrl}/users-last30min`);
  }
  getPieChartDashboard(){
    return this.http.get(`${this.apiUrl}/getPieChartDashboard`)
  }
}
