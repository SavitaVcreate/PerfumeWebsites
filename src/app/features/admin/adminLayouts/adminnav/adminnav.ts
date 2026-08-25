import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Theme } from '../../../../core/services/theme/theme';
import { CommonModule } from '@angular/common';
import { DownloadEvent } from '../../../../core/services/download-event/download-event';
declare var bootstrap: any;

@Component({
  selector: 'app-adminnav',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './adminnav.html',
  styleUrl: './adminnav.css',
})
export class Adminnav implements OnInit {
  user: any;
  toggleTheme() {
    this.themeService.toggleTheme();
  }
  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  }
  searchText = '';
  @Output() searchChanged = new EventEmitter<string>();

  onSearch() {
    this.searchChanged.emit(this.searchText);
  }
  pageTitle = 'Dashboard';
  constructor(private router: Router, public themeService: Theme) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.setPageTitle(this.router.url);
    });
    this.setPageTitle(this.router.url);
  }
  @Output() download = new EventEmitter<'pdf' | 'excel'>();

  downloadFile(type: 'pdf' | 'excel') {
    this.download.emit(type);
  }

  setPageTitle(url: string) {
    switch (true) {
      case url === '/admin':
        this.pageTitle = 'Dashboard'; break;
      case url.startsWith('/admin/order'):
        this.pageTitle = 'Order Management'; break;
      case url.startsWith('/admin/customers'):
        this.pageTitle = 'Customers'; break;
      case url.startsWith('/admin/transaction'):
        this.pageTitle = 'Transaction'; break;
      case url.startsWith('/admin/invoice'):
        this.pageTitle = 'Invoice'; break;
      case url.startsWith('/admin/add-products'):
        this.pageTitle = 'Add Products'; break;
      case url.startsWith('/admin/product-list'):
        this.pageTitle = 'Product List';
        break;
      case url.startsWith('/admin/admin-profile'):
        this.pageTitle = 'Admin Role';
        break;
      case url.startsWith('/admin/return-product'):
        this.pageTitle = 'Return';
        break;
      case url.startsWith('/settings'):
        this.pageTitle = 'Settings';
        break;
      default:
        this.pageTitle = 'Dashboard';
    }
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    const modalElement = document.getElementById("logoutModal");
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) { modal.hide(); }
    this.router.navigate(['/login']);
  }
}
