import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Navbar } from '../../../layouts/navbar/navbar';
@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css'
})
export class Reviews implements OnInit {
  productId = '';
  productName = '';
  productImage = '';
  selectedRating = 0;
  averageRating = 0;
  totalRatings = 0;
  reviewText = '';
  reviewTitle = '';
  loading = false;
  submitting = false;
  reviewSubmitted = false;
  errorMessage = '';
  successMessage = '';
  private apiUrl = 'http://localhost:5000/api/ratings';
  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.productId = params['productId'] || '';
      this.productName = params['productName'] || 'Product';
      const image = params['productImage'] || '';
      this.productImage = image ? `http://localhost:5000/uploads/profile/${image}` : '';
      if (this.productId) { this.getProductRating(); this.getUserRating(); }
    });
  }
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
  getProductRating(): void {
    this.http.get<any>(`${this.apiUrl}/${this.productId}`).subscribe({
      next: (res) => {
        console.log('Product Rating:', res);
        this.averageRating = Number(res?.averageRating || 0); this.totalRatings = Number(res?.totalRatings || 0);
      },
      error: (err) => {
        console.error('Product rating error:', err);
      }
    });
  }
  getUserRating(): void {
    this.http.get<any>(`${this.apiUrl}/user/${this.productId}`, { headers: this.getHeaders() }).subscribe({
      next: (res) => {
        console.log('User Rating:', res);
        this.selectedRating = Number(res?.rating || 0);
      }, error: (err) => {
        console.error('User rating error:', err);
      }
    });
  }
  selectRating(rating: number): void {
    this.selectedRating = rating;
    this.successMessage = '';
    this.errorMessage = '';
    this.reviewSubmitted = false;
  }
  getRatingText(): string {
    switch (this.selectedRating) {
      case 1:
        return 'Terrible';
      case 2:
        return 'Bad';
      case 3:
        return 'Average';
      case 4:
        return 'Good';
      case 5:
        return 'Excellent';
      default:
        return '';
    }
  }
  submitReview(): void {
    if (!this.productId) { this.errorMessage = 'Product information is missing.'; return; }
    if (this.selectedRating < 1 || this.selectedRating > 5) { this.errorMessage = 'Please select a rating.'; return; } this.submitting = true; this.errorMessage = ''; this.successMessage = ''; const body = { productId: this.productId, rating: this.selectedRating }; this.http.post<any>(this.apiUrl, body, { headers: this.getHeaders() }).subscribe({
      next: (res) => {
        this.submitting = false;
        this.reviewSubmitted = true;
        this.successMessage = 'Thank you! Your rating has been submitted successfully.';
        this.averageRating = Number(res?.averageRating || this.averageRating);
        this.totalRatings = Number(res?.totalRatings || this.totalRatings);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err?.error?.message || 'Unable to submit rating. Please try again.';
      }
    });
  }
  cancelReview(): void {
    this.router.navigate(['/orders']);
  }
}