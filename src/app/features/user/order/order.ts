import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Navbar } from '../../../layouts/navbar/navbar';
import { Paymentservice } from '../../../core/services/Payment/paymentservice';
import { Pagination } from '../../../shared/components/pagination/pagination';
@Component({
  selector: 'app-order',
  standalone: true,
  imports: [Navbar, CommonModule, FormsModule, Pagination],
  templateUrl: './order.html',
  styleUrls: ['./order.css']
})
export class Order implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  searchText = '';
  user: any = {};
  userId = '';
  currentPage = 1;
  itemsPerPage = 5;
  orderStatuses: string[] = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled'];
  selectedStatus: any = { Pending: false, Confirmed: false, Packed: false, Shipped: false, 'Out For Delivery': false, Delivered: false, Cancelled: false };
  selectedTime = { last30: false, year2026: false, year2025: false };
  constructor(private paymentService: Paymentservice, private cd: ChangeDetectorRef, private router: Router) { }
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    if (this.user?.id) {
      this.userId = this.user.id;
      this.getOrders();
    }
  }
  getOrders(): void {
    this.paymentService.getAllOrders(this.userId).subscribe({
      next: (res: any) => {
        this.orders = res?.orders || [];
        this.applyFilters();
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Get orders error:', err);
        this.orders = [];
        this.filteredOrders = [];
        this.currentPage = 1;
      }
    });
  }

  searchOrders(): void {
    this.currentPage = 1;
    this.applyFilters();
  }
  applyFilters(): void {
    let filtered = [...this.orders];
    const selectedStatuses = Object.keys(this.selectedStatus).filter(status => this.selectedStatus[status]);
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(order => selectedStatuses.includes(order.orderStatus));
    }
    if (this.selectedTime.last30) {
      const last30 = new Date();
      last30.setDate(last30.getDate() - 30);
      filtered = filtered.filter(order => new Date(order.createdAt) >= last30);
    }
    if (this.selectedTime.year2026) {
      filtered = filtered.filter(order => new Date(order.createdAt).getFullYear() === 2026);
    }
    if (this.selectedTime.year2025) {
      filtered = filtered.filter(order => new Date(order.createdAt).getFullYear() === 2025);
    }
    const search = this.searchText.trim().toLowerCase();
    if (search) {
      filtered = filtered.filter(order => {
        const orderId = String(order._id || '').toLowerCase();
        const productMatch = (order.items || []).some((item: any) => String(item.productName || '').toLowerCase().includes(search));
        const statusMatch = String(order.orderStatus || '').toLowerCase().includes(search);
        const refundMatch = String(order.refundStatus || '').toLowerCase().includes(search);
        const returnMatch = (order.items || []).some((item: any) => String(item.returnStatus || '').toLowerCase().includes(search));
        return (orderId.includes(search) || productMatch || statusMatch || refundMatch || returnMatch);
      });
    }
    this.filteredOrders = filtered;
    this.currentPage = 1;
    const pages = this.totalPages;
    if (pages > 0 && this.currentPage > pages) {
      this.currentPage = pages;
    }
  }
  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }

  get paginatedOrders(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage; return this.filteredOrders.slice(start, end);
  }
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) { return }
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  changeItemsPerPage(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(select.value);
    this.currentPage = 1;
  }
  get showingTo(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredOrders.length);
  }
  viewOrderDetails(orderId: string): void {
    this.router.navigate(['/order-details', orderId]);
  }
  hasRefundStatus(order: any): boolean {
    const status = order?.refundStatus;
    return (!!status && status !== 'Not Requested' && status !== 'None' && status !== '');
  }
  getRefundStatus(order: any): string {
    return order?.refundStatus || '';
  }
  getRefundStatusClass(order: any): string {
    const status = this.getRefundStatus(order);
    switch (status) {
      case 'Refund Requested': return 'refund-requested';
      case 'Refund Processing': return 'refund-processing';
      case 'Refund Completed': return 'refund-completed';
      case 'Refund Rejected': return 'refund-rejected';
      default: return 'refund-default';
    }
  }
  getReturnStatus(order: any): string {
    if (!order?.items || !Array.isArray(order.items)) { return ''; }
    const returnedItem = order.items.find((item: any) => item?.returnStatus && item.returnStatus !== 'Not Returned');
    return (returnedItem?.returnStatus || '');
  }
  hasReturnStatus(order: any): boolean {
    const status = this.getReturnStatus(order);
    return (status !== '' && status !== 'Not Returned');
  }
  getReturnStatusClass(order: any): string {
    const status = this.getReturnStatus(order);
    switch (status) {
      case 'Return Requested': return 'return-requested';
      case 'Return Approved': return 'return-approved';
      case 'Return Rejected': return 'return-rejected';
      case 'Return Picked Up': return 'return-picked-up';
      case 'Returned': return 'returned';
      default: return '';
    }
  }
  getOrderStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'pending';
      case 'Confirmed': return 'confirmed';
      case 'Packed': return 'packed';
      case 'Shipped': return 'shipped';
      case 'Out For Delivery': return 'out-for-delivery';
      case 'Delivered': return 'delivered';
      case 'Cancelled': return 'cancelled';
      default: return '';
    }
  }
  writeReview(order: any): void {
    const item = order?.items?.[0];
    if (!order?._id || !item?.productId) { return; } this.router.navigate(['/write-review'], {
      queryParams: {
        orderId: order._id,
        productId: item.productId,
        productName: item.productName
      }
    });
  }
}