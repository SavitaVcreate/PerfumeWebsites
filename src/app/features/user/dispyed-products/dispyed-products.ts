import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/products/product-service';
import { WhichlistService } from '../../../core/services/whish-list/whichlist-service';
import { Cartservice } from '../../../core/services/cart/cartservice';
import { AuthStateService } from '../../../core/services/authstate/auth-state-service';
import { SearchService } from '../../../core/services/search/search-service';
import { AlertService } from '../../../core/services/alert/alertservice';

@Component({
  selector: 'app-dispyed-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dispyed-products.html',
  styleUrls: ['./dispyed-products.css']
})
export class DispyedProducts implements OnInit {
  products: any[] = [];
  loading = false;
  filteredProducts: any[] = [];
  constructor(
    private productService: ProductService,
    private wishlistService: WhichlistService,
    private cartService: Cartservice,
    private router: Router,
    private cd: ChangeDetectorRef, private authState: AuthStateService,
    private searchService: SearchService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.searchService.search$.subscribe(text => {
      this.filterProducts(text);
    });
    this.loadProducts();
  }
  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (res: any) => { if (res && res.data) {
          this.products = [...res.data];
          this.filteredProducts = res.data;
        } else if (Array.isArray(res)) {
          this.products = [...res];
        } else {
          this.products = [];
        }
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.alertService.error(err);
        this.products = [];
        this.loading = false;
      }
    });
  }


  filterProducts(search: string) {
    if (!search) {
      this.filteredProducts = this.products;
      return;
    }
    search = search.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.productName?.toLowerCase().includes(search) ||
      product.shortName?.toLowerCase().includes(search) ||
      product.brand?.toLowerCase().includes(search) ||
      product.fragranceFamily?.toLowerCase().includes(search) ||
      product.tags?.toLowerCase().includes(search)
    );
  }

  openProduct(id: string) {
    this.router.navigate(['/product-details', id]);
  }
  onWishlistClick(product: any) {

    const token = localStorage.getItem('token');

    if (!token) {
      this.alertService.warning("Please login first");
      this.router.navigate(['/auth/login']);
      return;
    }
    if (product.isLiked) {
      return;
    }
    if (product.loading) {
      return;
    }
    product.loading = true;
    this.wishlistService.addToWishlist(product._id).subscribe({
      next: (res: any) => {
        product.isLiked = true;
        product.loading = false;
        // alert(res.message);
        this.alertService.success(res.message);
      },
      error: (err) => {
        product.loading = false;
        this.alertService.error("Wishlist failed");
      }
    });
  }
  addWishlist(productId: string) {
    this.wishlistService.addToWishlist(productId).subscribe({
      next: (res: any) => {
        this.alertService.success(res.message);
      },
      error: (err) => {
        this.alertService.error("Wishlist failed");
      }
    });
  }
  addToCart(productId: string) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      this.authState.highlightLogin();
      return;
    }
    const cartData = {
      userId: user.id,
      productId: productId,
      quantity: 1
    };
    this.cartService.addToCart(cartData).subscribe({
      next: (res: any) => {
        this.router.navigate(['/add-cart'], {
          state: {
            showSuccess: true
          }
        });
      },
      error: (err) => {
        this.alertService.error('Failed cart')
      }
    });
  }
}