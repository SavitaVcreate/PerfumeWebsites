import { ChangeDetectorRef, Component } from '@angular/core';
import { ProductService } from '../../../core/services/products/product-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from "../../../layouts/navbar/navbar";

@Component({
  selector: 'app-recentlyviewproduct',
  imports: [CommonModule, Navbar],
  templateUrl: './recentlyviewproduct.html',
  styleUrl: './recentlyviewproduct.css',
})
export class Recentlyviewproduct {
  products: any[] = [];

  constructor(private productService: ProductService, private router: Router, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadRecentProducts();
  }

  loadRecentProducts() {
    const recentIds = JSON.parse(localStorage.getItem('recentProducts') || '[]');
    if (!recentIds.length) { return; }
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        const allProducts = res.data;
        this.products = recentIds.map((id: string) => allProducts.find((p: any) => p._id === id)).filter((p: any) => p);
        this.cd.detectChanges();
      },
      error: (err) => { console.log(err); }
    });
  }

  openProduct(id: string) {
    this.saveRecent(id);
    this.router.navigate(['/product-details', id]);

  }

  saveRecent(productId: string) {
    let recent = JSON.parse(localStorage.getItem('recentProducts') || '[]');
    recent = recent.filter((id: string) => id !== productId);
    recent.unshift(productId);
    if (recent.length > 10) { recent = recent.slice(0, 10); }
    localStorage.setItem('recentProducts', JSON.stringify(recent));
  }
  clearHistory() {
    localStorage.removeItem('recentProducts');
    this.products = [];
  }
}
