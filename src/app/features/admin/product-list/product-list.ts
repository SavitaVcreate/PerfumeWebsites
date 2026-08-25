import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Adminnav } from '../adminLayouts/adminnav/adminnav';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/products/product-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../core/services/alert/alertservice';
import { Pagination } from '../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-product-list',
  imports: [Adminnav, RouterModule, CommonModule, FormsModule, Pagination],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  selectedProduct: any = null;
  showProductModal = false;
  productLoading = false;
  products: any[] = [];
  filteredProducts: any[] = [];
  paginatedProducts: any[] = [];
  selectedTab = 'all';
  searchText = '';
  sortAscending = true;
  totalProducts = 0;
  availableProducts = 0;
  outOfStockProducts = 0;
  newProducts = 0;
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  constructor(private productService: ProductService, private cd: ChangeDetectorRef, private alertService: AlertService) { }
  ngOnInit(): void {
    this.getProducts();
  }
  getProducts() {
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        this.products = res.data || [];
        this.filteredProducts = [...this.products];
        this.totalProducts = this.products.length;
        this.availableProducts = this.products.filter(x => x.availability === 'Available').length;
        this.outOfStockProducts = this.products.filter(x => x.stockStatus === 'Out Of Stock').length;
        const today = new Date();
        this.newProducts = this.products.filter(x => {
          const created = new Date(x.createdAt);
          const diff = (today.getTime() - created.getTime()) / (1000 * 60 * 60 * 24); return diff <= 7;
        }).length;
        this.currentPage = 1;
        this.updatePagination();
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('API Error:', err);
      }
    });

  }
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage) || 1;
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) { return; }
    this.currentPage = page;
    this.updatePagination();
    this.cd.detectChanges();
  }

  showAll(): void {
    this.filteredProducts = [...this.products];
    this.currentPage = 1;
    this.updatePagination();
  }

  showAvailable(): void {
    this.filteredProducts = this.products.filter(x => x.stockStatus === 'In Stock');
    this.currentPage = 1;
    this.updatePagination();
  }

  showOutOfStock(): void {
    this.filteredProducts = this.products.filter(x => x.stockStatus === 'Out Of Stock');
    this.currentPage = 1;
    this.updatePagination();
  }


  searchProducts(): void {
    const value = this.searchText.toLowerCase().trim();
    if (!value) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.productName?.toLowerCase().includes(value) ||
        product.gender?.toLowerCase().includes(value) ||
        product.stockStatus?.toLowerCase().includes(value));
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  filterAvailable(): void {
    this.filteredProducts = this.products.filter(product => product.availability === 'Available');
    this.currentPage = 1;
    this.updatePagination();
  }
  sortProducts(): void {
    if (this.sortAscending) {
      this.filteredProducts.sort((a, b) => a.productName.localeCompare(b.productName));
    } else {
      this.filteredProducts.sort((a, b) => b.productName.localeCompare(a.productName));
    }
    this.sortAscending = !this.sortAscending;
    this.currentPage = 1;
    this.updatePagination();
  }
  searchProductsinAdmin(value: string): void {
    value = value.toLowerCase().trim();
    if (!value) {
      this.filteredProducts = [...this.products];
      this.currentPage = 1;
      this.updatePagination();
      return;
    }
    this.filteredProducts = this.products.filter(product =>
      product.productName?.toLowerCase().includes(value) ||
      product.gender?.toLowerCase().includes(value) ||
      product.stockStatus?.toLowerCase().includes(value) ||
      product.shelfLife?.toString().toLowerCase().includes(value));
    this.currentPage = 1;
    this.updatePagination();
  }
  deleteProduct(id: string): void {
    if (!confirm('Are you sure you want to delete this product?')) { return; }
    this.productService.deleteProduct(id).subscribe({
      next: (res: any) => {
        this.alertService.success('Product deleted successfully.');
        this.products = this.products.filter(product => product._id !== id);
        this.filteredProducts = this.filteredProducts.filter(product => product._id !== id);
        this.totalProducts = this.products.length;
        this.availableProducts =
          this.products.filter(x => x.availability === 'Available').length;
        this.outOfStockProducts =
          this.products.filter(x => x.stockStatus === 'Out Of Stock').length;
        this.updatePagination();
        this.cd.detectChanges();
      },
      error: (err) => {
        this.alertService.error('Failed to delete product.');
      }
    });
  }
  viewProduct(id: string): void {
    this.productLoading = true;
    this.showProductModal = true;
    this.selectedProduct = null;
    this.productService.getProduct(id).subscribe({
      next: (res: any) => {
        this.selectedProduct = res.data || res;
        this.productLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Product details error:', err);
        this.productLoading = false;
        this.showProductModal = false;
        this.alertService.error('Failed to load product details.');
      }
    });
  }
  closeProductModal(): void {
    this.showProductModal = false;
    this.selectedProduct = null;
  }
}