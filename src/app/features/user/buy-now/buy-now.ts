import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AddressService } from '../../../core/services/address/address-service';
import { Paymentservice } from '../../../core/services/Payment/paymentservice';
import { AlertService } from '../../../core/services/alert/alertservice';
declare var bootstrap: any;
declare var Razorpay: any;

@Component({
  selector: 'app-buy-now',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buy-now.html',
  styleUrls: ['./buy-now.css']
})
export class BuyNow implements OnInit {
  addresses: any[] = [];
  selectedAddress: any = null;
  cartItems: any[] = [];
  user: any = null;
  userId: string = '';
  addressId: string = '';
  constructor(
    private router: Router,
    private alertService: AlertService,
    private addressService: AddressService,
    private paymentService: Paymentservice,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cartItems = history.state.cartItems || [];
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!this.user || !this.user.id) {
      this.alertService.warning('Please login first');
      this.router.navigate(['/auth/login']);
      return;
    }
    this.userId = this.user.id;
    console.log('User Id :', this.userId);
    this.getAddresses();
  }
  getAddresses(): void {
    this.addressService.getAddresses().subscribe({
      next: (res: any) => {
        if (res.success && res.data.length > 0) {
          this.addresses = res.data;
          this.selectedAddress =
            this.addresses.find((x: any) => x.isDefault) ||
            this.addresses[0];
          this.addressId = this.selectedAddress._id;
        }
        else {
          this.alertService.warning('Please Add an address')
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        this.alertService.error(err);
      }
    });
  }

  selectAddress(address: any): void {
    this.selectedAddress = address;
    this.addressId = address._id;
  }
  getSubTotal(): number {
    return this.cartItems.reduce((sum, item) => {
      return sum + (item.productId.sellingPrice * item.quantity);
    }, 0);
  }

  getDiscount(): number {
    return this.cartItems.reduce((sum, item) => {
      return sum + ((item.productId.mrp - item.productId.sellingPrice) * item.quantity);
    }, 0);
  }
  getTotal(): number {
    return this.getSubTotal();
  }
  paymentMethod: string = 'razorpay';
  continuePayment() {
    if (this.paymentMethod === 'razorpay') {
      this.checkoutWithRazorpay();
    } else {
      const modal = new bootstrap.Modal(
        document.getElementById('codModal')

      );
      modal.show();
    }
  }

  // continuePayment(): void {

  //   if (!this.userId) {

  //     alert("Please Login");

  //     return;

  //   }

  //   if (!this.addressId) {

  //     alert("Please Select Address");

  //     return;

  //   }

  //   if (this.paymentMethod === 'razorpay') {

  //     this.checkoutWithRazorpay();

  //   } else {

  //     this.placeCODOrder();

  //   }

  // }
  checkoutWithRazorpay(): void {
    const body = {
      userId: this.userId,
      addressId: this.addressId
    };
    this.paymentService.checkout(body).subscribe({
      next: (res: any) => {
        this.openRazorpay(res);
      },
      error: (err) => {
        this.alertService.error(err.error.message)
      }
    });
  }
  placeCODOrder(): void {
    const body = {
      userId: this.userId,
      addressId: this.addressId
    };
    this.paymentService.placeCODOrder(body).subscribe({
      next: (res: any) => {
        this.alertService.success("Order Placed Successfully");
        this.router.navigate(['/order-success']);
      },
      error: (err) => {
        // alert(err.error.message);
        this.alertService.error(err.error.message)
      }
    });
  }

  confirmCOD() {
    const body = {
      userId: this.userId,
      addressId: this.addressId
    };
    this.paymentService.placeCODOrder(body).subscribe({
      next: (res: any) => {
        const modal = bootstrap.Modal.getInstance(
          document.getElementById('codModal')
        );
        modal.hide();
        this.alertService.success('Order Placed Successfully');
        this.router.navigate(['/order-success']);
      },
      error: (err) => {
        this.alertService.error(err.error.message);
      }
    });
  }

  // continuePayment(): void {

  //   if (!this.userId) {

  //     alert("User Id Missing");

  //     return;

  //   }

  //   if (!this.addressId) {

  //     alert("Please Select Address");

  //     return;

  //   }

  //   const body = {

  //     userId: this.userId,

  //     addressId: this.addressId

  //   };

  //   console.log("Checkout Body :", body);

  //   this.paymentService.checkout(body).subscribe({

  //     next: (res: any) => {

  //       console.log(res);

  //       this.openRazorpay(res);

  //     },

  //     error: (err) => {

  //       console.log(err);

  //       alert(err.error?.message || "Checkout Failed");

  //     }

  //   });

  // }

  openRazorpay(res: any): void {
    const options = {
      key: 'rzp_test_R7iSQhvDeZJAgz',
      amount: res.razorpayOrder.amount,
      currency: res.razorpayOrder.currency,
      name: 'Perfume Store',
      description: 'Order Payment',
      image: '/assets/logo/logo.jpeg',
      order_id: res.razorpayOrder.id,
      handler: (response: any) => {
        this.verifyPayment(response, res.order._id);
      },
      prefill: {
        name: this.user.fullName,
        email: this.user.email,
        contact: this.user.mobileNo || this.user.moblieNo
      },
      theme: {
        color: '#8B5E3C'
      },
      modal: {
        ondismiss: () => {
          this.alertService.warning('Payment popup closed')
        }
      }
    };
    const razorpay = new Razorpay(options);
    razorpay.open();
  }
  verifyPayment(response: any, orderId: string): void {
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
        this.alertService.error('err.error?.message || "Payment Verification Failed"')
      }
    });
  }
}