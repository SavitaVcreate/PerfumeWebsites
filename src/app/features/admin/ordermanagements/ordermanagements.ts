import { ChangeDetectorRef, Component } from '@angular/core';
import { Adminnav } from '../adminLayouts/adminnav/adminnav';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order/order';
import { CommonModule } from '@angular/common';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { AlertService } from '../../../core/services/alert/alertservice';
@Component({
  selector: 'app-ordermanagements',
  imports: [Adminnav, RouterModule, CommonModule, Pagination],
  templateUrl: './ordermanagements.html',
  styleUrl: './ordermanagements.css',
})
export class Ordermanagements {
  orders: any[] = [];
  totalOrders = 0;
  pendingOrders = 0;
  deliveredOrders = 0;
  cancelledOrders = 0;
  totalGrowth = 0;
  pendingGrowth = 0;
  deliveredGrowth = 0;
  cancelledGrowth = 0;
  filteredOrders: any[] = [];
  selectedTab = 'All';
  currentPage = 1;
  itemsPerPage = 5;
  constructor(private orderService: OrderService, private cd: ChangeDetectorRef, private alertService: AlertService) { }
  ngOnInit(): void {
    this.loadDashboard();
    this.loadOrders();
    // const user = JSON.parse(localStorage.getItem('user')!);
    // this.loadOrders(user.id);
  }


  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }

  get paginatedOrders() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrders.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  loadDashboard() {
    this.orderService.getOrderCount().subscribe((res: any) => {
      this.totalOrders = res.totalOrders;
      this.pendingOrders = res.pendingOrders;
      this.deliveredOrders = res.deliveredOrders;
      this.cancelledOrders = res.cancelledOrders;
      this.totalGrowth = res.totalGrowth;
      this.pendingGrowth = res.pendingGrowth;
      this.deliveredGrowth = res.deliveredGrowth;
      this.cancelledGrowth = res.cancelledGrowth;
      this.cd.detectChanges();
    });
    //   this.orderService.getOrderCount().subscribe((res:any)=>{
    //     this.totalOrders = res.totalOrders;
    //     this.pendingOrders = res.pendingOrders;
    //     this.deliveredOrders = res.deliveredOrders;
    //     this.cancelledOrders = res.cancelledOrders;
    // this.cd.detectChanges();

    //   });

  }
  loadOrders() {
    this.orderService.getAdminOrders().subscribe((res: any) => {
      this.orders = res.orders;
      this.filteredOrders = [...this.orders];
      this.cd.detectChanges();
    });
  }
  // loadOrders(userId:string){

  //   this.orderService.getOrders(userId).subscribe((res:any)=>{

  //     this.orders = res.orders;
  //     this.filteredOrders = this.orders;
  // this.cd.detectChanges();

  //   });

  // }

  filter(status: string) {
    this.selectedTab = status;
    if (status === 'All') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(
        x => x.orderStatus === status
      );
    }
    this.currentPage = 1;
  }
  deleteOrder(orderId: string) {
    if (!confirm('Are you sure you want to delete this order permanently?')) {
      return;
    }
    this.orderService.deleteOrder(orderId).subscribe({
      next: (res: any) => {
        this.alertService.success('Order  deleted successfully');
        this.loadOrders();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  confirmOrder(order: any): void {
    if (!order?._id) {
      return;
    }
    if (order.orderStatus !== 'Pending') {
      return;
    }
    const confirmed = confirm(`Are you sure you want to confirm Order ${order._id}?`);
    if (!confirmed) { return; }
    this.orderService.updateOrderStatus(order._id, 'Confirmed').subscribe({
      next: (res: any) => {
        console.log('Order confirmed:', res);
        this.alertService.success('Order confirmed successfully. Confirmation email has been sent to the user.');
        order.orderStatus = 'Confirmed';
        this.cd.detectChanges();
        this.loadDashboard();
        this.loadOrders();
        // this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Confirm order error:', err);
        this.alertService.success('Unable to confirm order');
      }
    });
  }
  updateStatus(order: any, status: string): void {
    if (!order?._id) {
      console.error('Order ID missing');
      return;
    }
    if (!confirm(`Are you sure you want to change status to "${status}"?`)) {
      return;
    }
    console.log('Order ID:', order._id);
    console.log('New Status:', status);
    this.orderService.updateOrderStatus(order._id, status).subscribe({
      next: (res: any) => {
        console.log('SUCCESS:', res);
        this.alertService.success(res?.message || `Order ${status} successfully`);
        order.orderStatus = status;
        this.loadOrders();
        this.loadDashboard();
        this.cd.detectChanges();
      },
      error: (err: any) => {
        this.alertService.error(err?.error?.message || err?.error?.error || `Failed to update order status. HTTP ${err.status}`);
      }
    });
  }
}

