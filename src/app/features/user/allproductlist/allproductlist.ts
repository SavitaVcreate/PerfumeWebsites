import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Navbar } from '../../../layouts/navbar/navbar';
import { Footer } from '../../../layouts/footer/footer';
import { ProductService } from '../../../core/services/products/product-service';
import { WhichlistService } from '../../../core/services/whish-list/whichlist-service';
import { Cartservice } from '../../../core/services/cart/cartservice';
import { AuthStateService } from '../../../core/services/authstate/auth-state-service';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { AlertService } from '../../../core/services/alert/alertservice';
@Component({
  selector: 'app-allproductlist',
  standalone: true,
  imports: [Navbar,CommonModule,FormsModule,Footer,Pagination],
  templateUrl: './allproductlist.html',
  styleUrl: './allproductlist.css'
})
export class Allproductlist {
  appliedFilters: any[] = [];
  products: any[] = [];
  allProducts: any[] = [];
  pagedProducts: any[] = [];
  fragranceFamilies: string[] = [];
  brands: string[] = [];
  volumes: string[] = [];
  genders: string[] = [
    'Men',
    'Women',
    'Unisex'
  ];
  occasions: string[] = [
    'Office',
    'Party',
    'Wedding',
    'Daily Wear',
    'Date Night'
  ];
  stockStatusList: string[] = [
    'In Stock',
    'Out of Stock'
  ];
  selectedGender: string[] = [];
  selectedFamily: string[] = [];
  selectedBrand: string[] = [];
  selectedVolume: string[] = [];
  selectedOccasions: string[] = [];
  selectedStockStatus: string[] = [];
  showGender = false;
  showFamily = false;
  showPrice = false;
  showBrand = false;
  showVolume = false;
  showOccasion = false;
  showStockStatus = false;
  searchText = '';
  minPrice = 0;
  maxPrice = 10000;
  selectedPrice = 10000;
  selectedCategory = 'ALL';
  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 0;
  constructor(
    private productService: ProductService,
    private cd: ChangeDetectorRef,
    private wishlistService: WhichlistService,
    private cartService: Cartservice,
    private authState: AuthStateService,
    private router: Router,
    private alertService: AlertService
  ) { }
  ngOnInit(): void {
    this.loadProducts();
  }
  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        this.allProducts = res?.data || [];
        this.products = [...this.allProducts];
        this.fragranceFamilies = [
          ...new Set(
            this.allProducts
              .map((product: any) => product.fragranceFamily)
              .filter(Boolean)
          )
        ];
        this.brands = [
          ...new Set(
            this.allProducts
              .map((product: any) => product.brand)
              .filter(Boolean)
          )
        ];
        this.volumes = [
          ...new Set(
            this.allProducts
              .map((product: any) => product.volume)
              .filter(Boolean)
          )
        ];
        if (this.allProducts.length > 0) {
          const prices = this.allProducts
            .map((product: any) =>
              Number(product.sellingPrice) || 0
            );
          this.maxPrice = Math.max(...prices);
        } else {
          this.maxPrice = 10000;
        }
        this.selectedPrice = this.maxPrice;
        this.currentPage = 1;
        this.updatePagination();
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error(
          'Error loading products:',
          error
        );
        this.allProducts = [];
        this.products = [];
        this.pagedProducts = [];
        this.currentPage = 1;
        this.totalPages = 0;
      }
    });
  }



  updatePagination(): void {
    this.totalPages = Math.ceil(
      this.products.length / this.itemsPerPage
    );
    if (this.totalPages === 0) {
      this.currentPage = 1;
      this.pagedProducts = [];
      return;
    }
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
    const start =
      (this.currentPage - 1) *
      this.itemsPerPage;
    const end =
      start + this.itemsPerPage;
    this.pagedProducts =
      this.products.slice(start, end);
  }

  goToPage(page: number): void {
    if (
      page < 1 ||
      page > this.totalPages
    ) {
      return;
    }
    this.currentPage = page;
    this.updatePagination();
  }
  addToCart(productId: string): void {
    const user = JSON.parse(
      localStorage.getItem('user') || '{}'
    );
    if (!user.id) {
      this.authState.highlightLogin();
      return;
    }
    const cartData = {
      userId: user.id,
      productId: productId,
      quantity: 1
    };
    this.cartService
      .addToCart(cartData)
      .subscribe({
        next: () => {
          this.router.navigate(
            ['/add-cart'],
            {
              state: {
                showSuccess: true
              }
            }
          );
        },
        error: (err) => {
          this.alertService.error(err?.error?.message || 'Unable to add product to cart.')
        }
      });
  }

  onWishlistClick(productId: string): void {
    const token =
      localStorage.getItem('token');
    if (!token) {
      this.alertService.warning('Please login First');
      this.router.navigate(
        ['/auth/login']
      );
      return;
    }
    this.addWishlist(productId);
  }
  addWishlist(productId: string): void {
    this.wishlistService
      .addToWishlist(productId)
      .subscribe({
        next: (res: any) => {
          this.alertService.success(res?.message || 'Product added to wishlist.');
        },
        error: (err) => {
          this.alertService.error(err?.error?.message || 'Wishlist failed')
        }
      });
  }
  filterByGender(event: Event): void {
    const value =
      (event.target as HTMLSelectElement).value;
    if (value === 'All') {
      this.products = [
        ...this.allProducts
      ];
    } else {
      this.products =
        this.allProducts.filter(
          (product: any) =>
            product.gender?.includes(value)
        );
    }
    this.currentPage = 1;
    this.updatePagination();
  }
  onGenderChange(event: any): void {
    this.handleFilterChange(
      event,
      this.selectedGender,
      'gender'
    );
  }

  onBrandChange(event: any): void {
    this.handleFilterChange(
      event,
      this.selectedBrand,
      'brand'
    );
  }
  onFamilyChange(event: any): void {
    this.handleFilterChange(
      event,
      this.selectedFamily,
      'family'
    );
  }
  onVolumeChange(event: any): void {
    this.handleFilterChange(
      event,
      this.selectedVolume,
      'volume'
    );
  }

  onOccasionChange(event: any): void {
    this.handleFilterChange(
      event,
      this.selectedOccasions,
      'occasion'
    );
  }
  onStockStatusChange(event: any): void {
    this.handleFilterChange(
      event,
      this.selectedStockStatus,
      'stock'
    );
  }
  handleFilterChange(
    event: any,
    selectedArray: string[],
    type: string
  ): void {
    const value =
      event.target.value;
    if (event.target.checked) {
      if (!selectedArray.includes(value)) {
        selectedArray.push(value);
      }
      this.addFilter(
        type,
        value
      );

    } else {

      const index =
        selectedArray.indexOf(value);

      if (index > -1) {

        selectedArray.splice(
          index,
          1
        );
      }
      this.appliedFilters =
        this.appliedFilters.filter(
          (x) =>
            !(
              x.type === type &&
              x.value === value
            )
        );
    }

    this.filterProducts();
  }
  sortProducts(event: Event): void {
    const value =
      (event.target as HTMLSelectElement).value;
    switch (value) {
      case 'Featured':
        this.products = [
          ...this.allProducts
        ];
        break;
      case 'Newest':
        this.products.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
        break;
      case 'Price Low':
        this.products.sort(
          (a: any, b: any) =>
            Number(a.sellingPrice) -
            Number(b.sellingPrice)
        );
        break;
      case 'Price High':
        this.products.sort(
          (a: any, b: any) =>
            Number(b.sellingPrice) -
            Number(a.sellingPrice)
        );
        break;
    }
    this.currentPage = 1;
    this.updatePagination();
  }
  filterByFragrance(family: string): void {
    this.selectedCategory = family;
    if (family === 'ALL') {
      this.products = [
        ...this.allProducts
      ];
    } else {
      this.products =
        this.allProducts.filter(
          (product: any) =>
            product.fragranceFamily === family
        );
    }
    this.currentPage = 1;
    this.updatePagination();
  }
  filterProducts(): void {
    const search =
      this.searchText
        .trim()
        .toLowerCase();
    this.products =
      this.allProducts.filter(
        (product: any) => {
          const genderMatch =
            this.selectedGender.length === 0 ||
            this.selectedGender.some(
              (gender) =>
                product.gender?.includes(gender)
            );
          const familyMatch =
            this.selectedFamily.length === 0 ||
            this.selectedFamily.includes(
              product.fragranceFamily
            );
          const brandMatch =
            this.selectedBrand.length === 0 ||
            this.selectedBrand.includes(
              product.brand
            );
          const volumeMatch =
            this.selectedVolume.length === 0 ||
            this.selectedVolume.includes(
              product.volume
            );
          const occasionMatch =
            this.selectedOccasions.length === 0 ||
            this.selectedOccasions.some(
              (occasion) =>
                product.occasion?.includes(occasion)
            );

          const price =
            Number(product.sellingPrice) || 0;

          const priceMatch =
            price >= this.minPrice &&
            price <= this.selectedPrice;
          const searchMatch =
            search === '' ||
            product.productName
              ?.toLowerCase()
              .includes(search) ||
            product.shortName
              ?.toLowerCase()
              .includes(search) ||
            product.brand
              ?.toLowerCase()
              .includes(search) ||
            product.fragranceFamily
              ?.toLowerCase()
              .includes(search) ||
            product.countryOfOrigin
              ?.toLowerCase()
              .includes(search) ||
            product.tags
              ?.toLowerCase()
              .includes(search);
          const stockMatch =
            this.selectedStockStatus.length === 0 ||
            this.selectedStockStatus.includes(
              product.stockStatus
            );
          return (
            genderMatch &&
            familyMatch &&
            brandMatch &&
            volumeMatch &&
            occasionMatch &&
            priceMatch &&
            searchMatch &&
            stockMatch
          );
        }
      );
    this.currentPage = 1;
    this.updatePagination();
  }
  openProduct(id: string): void {
    let recent =
      JSON.parse(
        localStorage.getItem(
          'recentProducts'
        ) || '[]'
      );
    recent =
      recent.filter(
        (item: string) =>
          item !== id
      );
    recent.unshift(id);
    if (recent.length > 10) {
      recent =
        recent.slice(0, 10);
    }
    localStorage.setItem(
      'recentProducts',
      JSON.stringify(recent)
    );
    this.router.navigate([
      '/product-details',
      id
    ]);
  }
  toggleFilter(type: string): void {
    switch (type) {
      case 'gender':
        this.showGender =
          !this.showGender;
        break;
      case 'family':
        this.showFamily =
          !this.showFamily;
        break;
      case 'price':
        this.showPrice =
          !this.showPrice;
        break;
      case 'brand':
        this.showBrand =
          !this.showBrand;
        break;
      case 'volume':
        this.showVolume =
          !this.showVolume;
        break;
      case 'occasion':
        this.showOccasion =
          !this.showOccasion;
        break;
      case 'stock':
        this.showStockStatus =
          !this.showStockStatus;
        break;
    }
  }


  addFilter(
    type: string,
    value: string
  ): void {
    const exists =
      this.appliedFilters.find(
        (x) =>
          x.type === type &&
          x.value === value
      );
    if (!exists) {
      this.appliedFilters.push({
        type: type,
        value: value,
        label: value
      });
    }
  }
  removeFilter(filter: any): void {
    this.appliedFilters =
      this.appliedFilters.filter(
        (x) =>
          !(
            x.type === filter.type &&
            x.value === filter.value
          )
      );
    switch (filter.type) {
      case 'gender':
        this.selectedGender =
          this.selectedGender.filter(
            x => x !== filter.value
          );
        break;
      case 'brand':
        this.selectedBrand =
          this.selectedBrand.filter(
            x => x !== filter.value
          );
        break;
      case 'family':
        this.selectedFamily =
          this.selectedFamily.filter(
            x => x !== filter.value
          );
        break;
      case 'volume':
        this.selectedVolume =
          this.selectedVolume.filter(
            x => x !== filter.value
          );
        break;
      case 'occasion':
        this.selectedOccasions =
          this.selectedOccasions.filter(
            x => x !== filter.value
          );
        break;
      case 'stock':
        this.selectedStockStatus =
          this.selectedStockStatus.filter(
            x => x !== filter.value
          );
        break;
    }
    this.filterProducts();
  }

  clearAllFilters(): void {
    this.appliedFilters = [];
    this.selectedGender = [];
    this.selectedFamily = [];
    this.selectedBrand = [];
    this.selectedVolume = [];
    this.selectedOccasions = [];
    this.selectedStockStatus = [];
    this.minPrice = 0;
    this.selectedPrice = this.maxPrice;
    this.currentPage = 1;
    this.filterProducts();
  }
}