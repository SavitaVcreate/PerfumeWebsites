
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Paymentservice } from '../../../core/services/Payment/paymentservice';
import { AlertService } from '../../../core/services/alert/alertservice';

@Component({
  selector: 'app-cancelorder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cancelorder.html',
  styleUrls: ['./cancelorder.css']
})
export class Cancelorder implements OnInit {
  order: any = null;
  reason = '';
  comment = '';
  reasons = [
    'I want to change the delivery address',
    'Price of the product has now decreased',
    "I'm worried about the ratings/reviews",
    'I want to change the contact details',
    'I was hoping for a shorter delivery time',
    'I want to change the payment option',
    'My reasons are not listed here'
  ];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: Paymentservice,
    private cd: ChangeDetectorRef, private alertService: AlertService
  ) { }
  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.paymentService.getOrderDetails(orderId).subscribe({
        next: (res: any) => {
          this.order = res.order;
          this.cd.detectChanges();
        },
        error: (err) => {
          this.alertService.error(err)
        }
      });
    }
  }

  confirmCancel() {
    if (!this.reason) {
      this.alertService.warning('Please select cancellation reason')
      return;
    }
    const body = {
      reason: this.reason,
      comment: this.comment
    };
    this.paymentService.cancelOrder(this.order._id, body).subscribe({
      next: (res: any) => {
        this.alertService.success(res.message)
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.alertService.error(err.error.message);
      }
    });
  }
}
