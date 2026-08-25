import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Adminnav } from '../adminLayouts/adminnav/adminnav';
import { ReturnService } from '../../../core/services/returns/return-service';
import { AlertService } from '../../../core/services/alert/alertservice';
@Component({
  selector: 'app-returnproduct',
  standalone: true,
  imports: [CommonModule, Adminnav],
  templateUrl: './returnproduct.html',
  styleUrl: './returnproduct.css'
})
export class Returnproduct implements OnInit {
  returnRequests: any[] = [];
  filteredReturns: any[] = [];
  returnLoading = false;
  selectedStatus = 'All';
  constructor(private returnService: ReturnService, private alertService: AlertService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadReturnRequests();
  }

  loadReturnRequests(): void {
    this.returnLoading = true;
    this.returnService.getAllReturns().subscribe({
      next: (res: any) => {
        console.log('Return API Response:', res);
        const returns = res?.returns ?? res?.data ?? [];
        this.returnRequests = returns.map(
          (item: any) => {
            let normalizedStatus = item.status;
            switch (item.status) {
              case 'Return Requested': normalizedStatus = 'Pending'; break;
              case 'Return Approved': normalizedStatus = 'Approved'; break;
              case 'Return Rejected': normalizedStatus = 'Rejected'; break;
              case 'Return Picked Up': normalizedStatus = 'Picked Up'; break;
              case 'Return Received': case 'Returned': normalizedStatus = 'Returned'; break;
              case 'Refund Processing': normalizedStatus = 'Refund Processing'; break;
              case 'Refund Completed': normalizedStatus = 'Refund Completed'; break;
              default: normalizedStatus = item.status; break;
            }
            return {
              ...item,
              status: normalizedStatus,
              orderIdValue: item.orderId?._id || item.orderId || '-',
              productIdValue: item.productId?._id || item.productId || '-',
              productNameValue: item.productName || item.productId?.productName || item.orderId?.items?.find((x: any) => x.productId?.toString() === item.productId?._id?.toString())?.productName || 'Product',
              productImageValue: item.productImage || item.productId?.mainImage || item.productId?.image || item.orderId?.items?.find((x: any) => x.productId?.toString() === item.productId?._id?.toString())?.image || ''
            };
          });
        this.applyFilter();
        this.returnLoading = false;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('Get return requests error:', err);
        this.returnRequests = [];
        this.filteredReturns = [];
        this.returnLoading = false;
        this.alertService.error(err?.error?.message || 'Unable to load return requests');
        this.cd.detectChanges();
      }
    });
  }
  filterReturns(status: string): void {
    this.selectedStatus = status;
    this.applyFilter();
  }
  applyFilter(): void {
    if (this.selectedStatus === 'All') {
      this.filteredReturns = [...this.returnRequests];
      return;
    }
    this.filteredReturns = this.returnRequests.filter(item => item.status === this.selectedStatus);
  }
  get totalReturnsCount(): number {
    return this.returnRequests.length;
  }
  get pendingCount(): number {
    return this.returnRequests.filter(x => x.status === 'Pending').length;
  }

  get approvedCount(): number {
    return this.returnRequests.filter(x => x.status === 'Approved').length;
  }
  get pickedUpCount(): number {
    return this.returnRequests.filter(x => x.status === 'Picked Up').length;
  }
  get returnedCount(): number {
    return this.returnRequests.filter(x => x.status === 'Returned').length;
  }

  get refundProcessingCount(): number {
    return this.returnRequests.filter(x => x.status === 'Refund Processing').length;
  }

  get refundCompletedCount(): number {
    return this.returnRequests.filter(x => x.status === 'Refund Completed').length;
  }
  get rejectedCount(): number {
    return this.returnRequests.filter(x => x.status === 'Rejected').length;
  }
  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'bg-warning text-dark';
      case 'Approved':
        return 'bg-success';
      case 'Rejected':
        return 'bg-danger';
      case 'Picked Up':
        return 'bg-info text-dark';
      case 'Returned':
        return 'bg-primary';
      case 'Refund Processing':
        return 'bg-secondary';
      case 'Refund Completed':
        return 'bg-dark';
      default:
        return 'bg-secondary';
    }
  }
  approveReturn(returnRequest: any): void {
    if (!returnRequest?._id) {
      this.alertService.error('Return request ID is missing');
      return;
    }
    const confirmed = confirm('Are you sure you want to approve this return request?');
    if (!confirmed) { return; }
    this.returnService.approveReturn(returnRequest._id).subscribe({
      next: (res: any) => {
        console.log('Return approved:', res);
        this.alertService.success(res?.message || 'Return request approved successfully');
        this.loadReturnRequests();
      },
      error: (err: any) => {
        console.error('Approve return error:', err);
        this.alertService.error(err?.error?.message || 'Unable to approve return request');
      }
    });
  }
  rejectReturn(returnRequest: any): void {
    if (!returnRequest?._id) {
      this.alertService.error('Return request ID is missing');
      return;
    }
    const reason = prompt('Enter rejection reason:');
    if (reason === null) { return; }
    if (reason.trim() === '') {
      this.alertService.error('Please enter rejection reason'); return;
    }
    const confirmed = confirm('Are you sure you want to reject this return request?');
    if (!confirmed) { return; }
    this.returnService.rejectReturn(returnRequest._id,).subscribe({
      next: (res: any) => {
        console.log('Return rejected:', res);
        this.alertService.success(res?.message || 'Return request rejected successfully'); this.loadReturnRequests();
      },
      error: (err: any) => {
        console.error('Reject return error:', err);
        this.alertService.error(err?.error?.message || 'Unable to reject return request');
      }
    });
  }
  markReturnPickedUp(returnRequest: any): void {
    if (!returnRequest?._id) { return; }
    const confirmed = confirm('Mark this return as picked up?');
    if (!confirmed) { return; } this.returnService.markReturnPickedUp(returnRequest._id).subscribe({ next: (res: any) => { console.log('Return picked up:', res); this.alertService.success(res?.message || 'Return marked as picked up'); this.loadReturnRequests(); }, error: (err: any) => { console.error('Picked up error:', err); this.alertService.error(err?.error?.message || 'Unable to update return'); } });
  }
  markReturned(returnRequest: any): void {
    if (!returnRequest?._id) { return; }
    const confirmed = confirm('Mark this product as returned to seller?');
    if (!confirmed) { return; }
    this.returnService.markReturned(returnRequest._id).subscribe({ next: (res: any) => { console.log('Product returned:', res); this.alertService.success(res?.message || 'Product marked as returned'); this.loadReturnRequests(); }, error: (err: any) => { console.error(); this.alertService.error(err?.error?.message || 'Unable to update return'); } });
  }
  processRefund(returnRequest: any): void {

    if (!returnRequest?._id) {

        this.alertService.error(
            "Return request ID is missing"
        );

        return;
    }


    const confirmed = confirm(
        "Are you sure you want to process the refund?"
    );


    if (!confirmed) {
        return;
    }


    this.returnService
        .processRefund(returnRequest._id)
        .subscribe({

            next: (res: any) => {

                console.log(
                    "Refund response:",
                    res
                );

                this.alertService.success(
                    res?.message ||
                    "Refund processed successfully"
                );

                this.loadReturnRequests();

            },

            error: (err: any) => {

                console.error(
                    "Refund error:",
                    err
                );

                this.alertService.error(
                    err?.error?.message ||
                    "Unable to process refund"
                );

            }

        });

}
  // processRefund(returnRequest: any): void {
  //   if (!returnRequest?._id) { return; }
  //   const confirmed = confirm('Start refund processing for this return?');
  //   if (!confirmed) { return; }
  //   this.returnService.processRefund(returnRequest._id).subscribe({
  //     next: (res: any) => { console.log('Refund processing:', res); this.alertService.success(res?.message || 'Refund processing started'); this.loadReturnRequests(); },
  //     error: (err: any) => {
  //       console.error('Refund processing error:', err); this.alertService.error(err?.error?.message || 'Unable to process refund');
  //     }
  //   });
  // }
  completeRefund(returnRequest: any): void {
    if (!returnRequest?._id) { return; }
    const confirmed = confirm('Complete this refund?');
    if (!confirmed) { return; }
    this.returnService.completeRefund(returnRequest._id).subscribe({
      next: (res: any) => {
        console.log('Refund completed:', res);
        this.alertService.success(
          res?.message || 'Refund completed successfully');
        this.loadReturnRequests();
      },
      error: (err: any) => { console.error('Complete refund error:', err); this.alertService.error(err?.error?.message || 'Unable to complete refund'); }
    })
  }
}