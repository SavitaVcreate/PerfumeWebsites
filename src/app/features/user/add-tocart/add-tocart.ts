import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cartservice } from '../../../core/services/cart/cartservice';
import confetti from 'canvas-confetti';
import { Router } from "@angular/router";
import { Navbar } from "../../../layouts/navbar/navbar";

@Component({
  selector: 'app-add-tocart',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './add-tocart.html',
  styleUrls: ['./add-tocart.css']
})
export class AddTocart implements OnInit {
  showMessage = false;
  message = '';
  showPopup = false;
  cartItems: any[] = [];
  userId = '';
  constructor(
    private cartService: Cartservice,
    private cd: ChangeDetectorRef,
    private router: Router
  ) { }
  ngOnInit(): void {
    if (history.state.showSuccess) {
      this.showPopup = true;
      confetti({
        particleCount: 500,
        spread: 120,
        origin: {
          y: 0.6
        }
      });
      setTimeout(() => {
        this.showPopup = false;
        history.replaceState({}, '');
        this.cd.detectChanges();
      }, 3000);
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      return;
    }
    this.userId = user.id;
    this.loadCart();
  }
  loadCart(): void {
    this.cartService.getCart(this.userId).subscribe({
      next: (res: any) => {
        this.cartItems = res.data || [];
        this.cartService.setCartCount(this.cartItems.length);
        this.cd.detectChanges();
      },
      error: () => {
        this.cartItems = [];
      }
    });
  }
  get subtotal(): number {
    return this.cartItems.reduce((sum: number, item: any) => {
      return sum + (item.productId.sellingPrice * item.quantity);
    }, 0);
  }
  increase(item: any) {
    this.cartService.updateCart(item._id, item.quantity + 1)
      .subscribe(() => this.loadCart());
  }
  decrease(item: any) {
    if (item.quantity == 1) return;
    this.cartService.updateCart(item._id, item.quantity - 1)
      .subscribe(() => this.loadCart());
  }
  remove(item: any) {
    this.cartService.deleteCart(item._id).subscribe({
      next: () => {
        this.message = 'Item removed from cart successfully.';
        this.showMessage = true;
        this.cd.detectChanges(); // Update UI immediately
        this.loadCart();
        setTimeout(() => {
          this.showMessage = false;
          this.cd.detectChanges(); // Update UI after hiding
        }, 5000);
      },
      error: () => {
        this.message = 'Failed to remove item.';
        this.showMessage = true;
        this.cd.detectChanges();
        setTimeout(() => {
          this.showMessage = false;
          this.cd.detectChanges();
        }, 5000);
      }
    });
  }
  
  trackByCart(index: number, item: any) {

    return item._id;

  }

  buyNow() {

    this.router.navigate(['/buy-now'], {
      state: {
        cartItems: this.cartItems
      }
    });

  }
}