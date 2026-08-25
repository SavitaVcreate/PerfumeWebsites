import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Cartservice } from '../../core/services/cart/cartservice';
import { AuthStateService } from '../../core/services/authstate/auth-state-service';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../core/services/search/search-service';
import { WhichlistService } from '../../core/services/whish-list/whichlist-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  isLoggedIn = false;
  highlight = false;
  cartCount = 0;
  showSearch = false;
  searchText = '';
  user: any = {};
  isScrolled = false;
  wishlistCount = 0;

  constructor(private router: Router, private cartService: Cartservice, private authState: AuthStateService,
    private searchService: SearchService, private wishlistService: WhichlistService
  ) { }
  @HostListener('window:scroll', [])

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  onWindowScroll() {
    this.isScrolled = window.scrollY > 80;
  }
  ngOnInit(): void {
    this.wishlistService.wishlistCount$.subscribe(count => { this.wishlistCount = count; });
    this.authState.highlightLogin$.subscribe((value) => { this.highlight = value; });
    this.checkLogin();
    this.cartService.cartCount$.subscribe(count => { this.cartCount = count; });
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.id) {
      this.cartService.getCart(user.id).subscribe((res: any) => {
        this.cartService.setCartCount(res.data?.length || 0);
      });
    }
    this.loadWishlistCount();
  }

  searchProducts() {
    console.log('Searching:', this.searchText);
    const text = this.searchText.trim();
    this.searchService.setSearch(text);
    if (text) {
      const section = document.getElementById('collection');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setTimeout(() => { this.showSearch = false; }, 300);
    }
  }
  checkLogin() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn = true;
      this.user = JSON.parse(localStorage.getItem('user') || '{}');
    }
    else {
      this.isLoggedIn = false;
    }
  }
  logout() {
    localStorage.clear();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  loadWishlistCount() {
    this.wishlistService.getWishlist().subscribe((res: any) => {
      const count = res.wishlist?.length || res.data?.length || res.length || 0;
      this.wishlistService.setWishlistCount(count);
    });
  }
}