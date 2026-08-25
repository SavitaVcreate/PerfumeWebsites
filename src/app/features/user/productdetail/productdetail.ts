import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/products/product-service';
import { Cartservice } from '../../../core/services/cart/cartservice';
import { AuthStateService } from '../../../core/services/authstate/auth-state-service';
import { Navbar } from '../../../layouts/navbar/navbar';
import { WhichlistService } from '../../../core/services/whish-list/whichlist-service';
import { AlertService } from '../../../core/services/alert/alertservice';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './productdetail.html',
  styleUrl: './productdetail.css',
})
export class Productdetail implements OnInit {
  product: any;
  selectedImage = '';
  showMessage = false;
  message = '';
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cd: ChangeDetectorRef,
    private cartService: Cartservice,
    private authState: AuthStateService,
    private router: Router,
    private Wishlist: WhichlistService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProduct(id).subscribe({
        next: (res: any) => {
          this.product = res.data;
          this.selectedImage =
            'http://localhost:5000/uploads/profile/' +
            this.product.mainImage;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }
  changeImage(image: string) {
    this.selectedImage =
      'http://localhost:5000/uploads/profile/' + image;
  }
  addToCart() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      this.authState.highlightLogin();
      this.router.navigate(['/auth/login']);
      return;
    }
    const cartData = {
      userId: user.id,
      productId: this.product._id,
      quantity: 1
    };
    this.cartService.addToCart(cartData).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Product added to cart successfully.';
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
        }, 3000);
      },
      error: (err) => {
        this.message = err.error?.message || 'Unable to add product to cart.';
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
        }, 3000);
      }
    });
  }
  buyNow(productId: string) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      this.authState.highlightLogin();
      this.router.navigate(['/auth/login']);
      return;
    }
    const cartData = {
      userId: user.id,
      productId: productId,
      quantity: 1
    };
    this.cartService.addToCart(cartData).subscribe({
      next: () => {
        this.router.navigate(['/add-cart'], {
          state: {
            showSuccess: true
          }
        });
      },
      error: (err) => {
        this.alertService.error(err.Error.message);
      }
    });
  }
  //  buyNow(productId: string) {

  //   const user = JSON.parse(localStorage.getItem('user') || '{}');

  //   if (!user.id) {
  //     this.authState.highlightLogin();
  //     return;
  //   }

  //   const cartData = {
  //     userId: user.id,
  //     productId: productId,
  //     quantity: 1
  //   };

  //   this.cartService.addToCart(cartData).subscribe({

  //     next: (res: any) => {

  //       this.router.navigate(['/add-cart'], {
  //         state: {
  //           showSuccess: true
  //         }
  //       });

  //     },

  //     error: (err) => {

  //       alert(err.error?.message);

  //     }

  //   });

  //  }

  onWishlistClick(product: any) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.message = 'Please login first.';
      this.showMessage = true;
      this.router.navigate(['/auth/login']);
      return;
    }
    if (product.loading) {
      return;
    }
    product.loading = true;
    this.Wishlist.addToWishlist(product._id).subscribe({
      next: (res: any) => {
        product.loading = false;
        product.isLiked = true;
        this.message = res.message;
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
        }, 3000);
      },
      error: (err) => {
        product.loading = false;
        if (err.error?.message === 'Product already exists in wishlist.') {
          product.isLiked = true;
        }
        this.message = err.error?.message || 'Wishlist failed';
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
        }, 3000);
      }
    });
  }
  // buyNow() {

  //   const user = JSON.parse(localStorage.getItem('user') || '{}');

  //   if (!user.id) {

  //     this.authState.highlightLogin();

  //     this.router.navigate(['/auth/login']);

  //     return;

  //   }

  //   const buyNowItem = [{
  //     productId: this.product,
  //     quantity: 1
  //   }];

  //   console.log(buyNowItem);

  //   this.router.navigate(['/buy-now'], {
  //     state: {
  //       cartItems: buyNowItem
  //     }
  //   });

  // }
}