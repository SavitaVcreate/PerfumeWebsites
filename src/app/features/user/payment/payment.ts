import { Component } from '@angular/core';
import { Paymentservice } from '../../../core/services/Payment/paymentservice';
import { Router } from '@angular/router';
import { AlertService } from '../../../core/services/alert/alertservice';
declare var Razorpay: any;
@Component({
  selector: 'app-payment',
  imports: [],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment {
  userId = '';
  addressId = '';
  constructor(
    private paymentService: Paymentservice, private alertService: AlertService,
    private router: Router
  ) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user.id;
  }
  continuePayment() {
    const body = {
      userId: this.userId,
      addressId: this.addressId
    };
    this.paymentService.checkout(body).subscribe({
      next: (res: any) => {
        this.openRazorpay(res);
      },
      error: (err) => {
        this.alertService.error(err)
      }
    });
  }

  openRazorpay(res: any) {
    const options = {
      key: 'rzp_test_xxxxxxxxx',
      amount: res.razorpayOrder.amount,
      currency: 'INR',
      name: 'Perfume Store',
      description: 'Perfume Order',
      image: 'assets/logo/logo.png',
      order_id: res.razorpayOrder.id,
      handler: (response: any) => {
        this.verifyPayment(response, res.order._id);
      },
      prefill: {
        name: 'Savita Gore',
        email: 'savita@gmail.com',
        contact: '9999999999'
      },
      theme: {
        color: '#8B5E3C'
      }
    };
    const razorpay = new Razorpay(options);
    razorpay.open();
  }
  verifyPayment(response: any, orderId: string) {
    const body = {
      orderId,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature
    };
    this.paymentService.verifyPayment(body).subscribe({
      next: (res: any) => {
        this.alertService.success('Payment Successful');
        this.router.navigate(['/order-success']);
      },
      error: (err) => {
        this.alertService.error("Payment Failed")
        console.log(err);
      }
    });
  }
}

