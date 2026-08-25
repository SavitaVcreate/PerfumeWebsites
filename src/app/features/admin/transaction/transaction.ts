import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Sidebar } from '../adminLayouts/sidebar/sidebar';
import { Adminnav } from '../adminLayouts/adminnav/adminnav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dashboardservice } from '../../../core/services/dashboard/dashboardservice';
import { Pagination } from '../../../shared/components/pagination/pagination';
@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [Adminnav, RouterOutlet, FormsModule, CommonModule, RouterLink, Pagination],
  templateUrl: './transaction.html',
  styleUrl: './transaction.css'
})
export class Transaction implements OnInit {
  selectedStatus = 'All';
  products: any[] = [];
  filteredProducts: any[] = [];
  transactions: any[] = [];
  // transactions: any[] = [];
  filteredTransactions: any[] = [];
  paginatedTransactions: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  pages: number[] = [];
  transactionDashboard: any = {};
  sortAscending = false;
  constructor(private dashboard: Dashboardservice, private cd: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.loadTransactions();
    this.getTransactionDashboard();
  }
  getTransactionDashboard() {
    this.dashboard.getTranactionDashboard().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.transactionDashboard = res.data;
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  loadTransactions() {
    this.dashboard.getTransaction().subscribe({
      next: (res: any) => {
        if (res.status) {
          this.transactions = res.data;
          this.filteredTransactions = [...this.transactions];
          this.cd.detectChanges();
          this.setPagination();
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  filterTransactions(status: string) {
    this.selectedStatus = status;
    if (status === 'All') { this.filteredTransactions = [...this.transactions]; }
    else { this.filteredTransactions = this.transactions.filter(item => item.status === status); }
    this.currentPage = 1;
    this.setPagination();
  }
  getAllCount(): number {
    return this.transactions.length;
  }

  getCompletedCount(): number {
    return this.transactions.filter(x => x.status === 'Delivered').length;
  }

  getPendingCount(): number {
    return this.transactions.filter(x => x.status === 'Pending').length;
  }

  getCancelledCount(): number {
    return this.transactions.filter(x => x.status === 'Cancelled').length;
  }

  sortByDate() {
    this.sortAscending = !this.sortAscending;
    this.filteredTransactions.sort((a: any, b: any) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return this.sortAscending ? dateA - dateB : dateB - dateA;
    });
    this.updatePaginatedData();
  }
  searchTransactionstable(value: string) {
    value = value.toLowerCase().trim();
    if (!value) {
      this.filteredTransactions = [...this.transactions];
    } else {
      this.filteredTransactions = this.transactions.filter(item =>
        item.customerId.toLowerCase().includes(value) ||
        item.name.toLowerCase().includes(value) ||
        item.method.toLowerCase().includes(value) ||
        item.total.toString().includes(value));
    }
    this.currentPage = 1;
    this.setPagination();
  }
  searchTransactions(value: string) {
    value = value.toLowerCase().trim();
    if (!value) {
      this.filteredTransactions = [...this.transactions];
    } else {
      this.filteredTransactions = this.transactions.filter(item =>
        item.customerId.toLowerCase().includes(value) ||
        item.name.toLowerCase().includes(value) ||
        item.method.toLowerCase().includes(value) ||
        item.total.toString().includes(value));
    }
    this.currentPage = 1;
    this.setPagination();
  }
  resetTransactions() {
    this.selectedStatus = 'All';
    this.filteredTransactions = [...this.transactions];
    this.currentPage = 1;
    this.setPagination();
  }
  setPagination() {
    this.totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedTransactions = this.filteredTransactions.slice(start, end);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedData();
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }
  searchProductsinAdmin(value: string) {
    value = value.toLowerCase().trim();
    if (!value) {
      this.filteredTransactions = [...this.transactions];
    } else {
      this.filteredTransactions = this.transactions.filter(item =>
        item.customerId.toLowerCase().includes(value) ||
        item.name.toLowerCase().includes(value) ||
        item.method.toLowerCase().includes(value)
      );
    }
    this.currentPage = 1;
    this.setPagination();
  }
}