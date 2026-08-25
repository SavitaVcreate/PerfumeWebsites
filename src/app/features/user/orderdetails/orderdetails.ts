import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Navbar } from '../../../layouts/navbar/navbar';
import { Paymentservice } from '../../../core/services/Payment/paymentservice';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environment/environment';
@Component({
  selector: 'app-orderdetails',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './orderdetails.html',
  styleUrls: ['./orderdetails.css']
})
export class Orderdetails implements OnInit {
  refundUpiId: string = '';
showReturnModal = false;
returnReason = '';
returnDescription = '';
returnQuantity = 1;
returnLoading = false;
returnMessage = '';
returnError = ''
// returnApiUrl='http://localhost:5000/api/returns'
returnApiUrl=`${environment.apiUrl}/returns`
// returnApiUrl = 'http://localhost:5000/api/returns';

returnReasons = [
  'Damaged Product',
  'Wrong Product',
  'Product Not as Described',
  'Quality Issue',
  'Received Different Product',
  'Changed My Mind',
  'Other'
];
  order: any = null;
  loading = true;
  selectedRating = 0;
  averageRating = 0;
  totalRatings = 0;
  ratingLoading = false;
  productId = '';
  productName = '';
  productImage = '';
  reviewSubmitted = false;
  showTrackingModal = false;
  private ratingApiUrl = '${environment.apiUrl}/ratings';
  constructor(private route: ActivatedRoute, private router: Router, private paymentService: Paymentservice, private http: HttpClient, private cd: ChangeDetectorRef) { }
  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    console.log('Order Id:', orderId);
    if (!orderId) {
      this.loading = false;
      return;
    }
    this.getOrderDetails(orderId);
  }
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
  getOrderDetails(orderId: string): void {
    this.loading = true;
    this.paymentService.getOrderDetails(orderId).subscribe({
      next: (res: any) => {
        console.log('Order Details API Response:', res);
        this.order = res?.order || null;
        console.log('Order:', this.order);
        this.loading = false;
        if (this.order?.orderStatus === 'Delivered') {
          this.loadOrderProductRating();
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Order details error:', err);
        this.order = null;
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }
  getOrderProductId(): string {
    const item = this.order?.items?.[0];
    if (!item) {
      return '';
    }
    return (item.productId?._id || item.productId || item.product?._id || item._id || '');
  }

  loadOrderProductRating(): void {
    const productId = this.getOrderProductId();
    if (!productId) {
      console.warn('Product ID not found in order.');
      return;

    }
    console.log('Loading rating for product:', productId);
    this.getProductRating(productId);
    this.getUserRating(productId);
  }
  getProductRating(productId: string): void {
    this.ratingLoading = true;
    this.http.get<any>(`${this.ratingApiUrl}/${productId}`).subscribe({
      next: (res) => {
        console.log('Product Rating:', res);
        this.averageRating = Number(res?.averageRating || 0);
        this.totalRatings = Number(res?.totalRatings || 0);
        this.ratingLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Product rating error:', err);
        this.averageRating = 0;
        this.totalRatings = 0;
        this.ratingLoading = false;
      }
    });
  }
  getUserRating(productId: string): void {
    const token = localStorage.getItem('token');
    if (!token) { console.warn('User token not found.'); return; }
    this.http.get<any>(`${this.ratingApiUrl}/user/${productId}`, { headers: this.getHeaders() }).subscribe({
      next: (res) => {
        console.log('Logged User Rating:', res);
        this.selectedRating = Number(res?.rating || 0);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('User rating error:', err);
        this.selectedRating = 0;
      }
    });
  }
  selectRating(rating: number): void {
    if (this.order?.orderStatus !== 'Delivered') {
      return;
    }
    this.selectedRating = rating;
    console.log('Selected Rating:', rating);
  }
  getRatingText(): string {
    switch (this.selectedRating) {
      case 1:
        return 'Terrible';
      case 2:
        return 'Bad';
      case 3:
        return 'Okay';
      case 4:
        return 'Good';
      case 5:
        return 'Excellent';
      default:
        return 'Terrible';
    }
  }
  openReviewPage(): void {
    if (!this.order?._id) {
      return;
    }
    const item = this.order.items?.[0];
    if (!item) {
      return;
    }
    const productId = item.productId || item.product?._id || item._id || '';
    const productName = item.productName || item.product?.productName || 'Product';
    const productImage = item.image || item.product?.image || '';
    this.router.navigate(['/write-review'],
      {
        queryParams: {
          orderId: this.order._id,
          productId: productId,
          productName: productName,
          productImage: productImage
        }
      }
    );
  }
  getStatusDate(status: string): any {
    if (!this.order) {
      return null;
    }
    if (
      this.order.statusHistory &&
      this.order.statusHistory.length
    ) {
      const history = this.order.statusHistory.slice().reverse().find((item: any) => item.status === status);
      if (
        history?.changedAt
      ) {
        return history.changedAt;
      }
    }
    if (
      status === 'Confirmed' &&
      this.order.orderStatus === 'Confirmed'
    ) {
      return this.order.updatedAt;
    }
    if (
      status === 'Cancelled' &&
      this.order.orderStatus === 'Cancelled'
    ) {
      return this.order.updatedAt;
    }
    return null;
  }
  isCancelledOrder(): boolean {
    return (
      this.order?.orderStatus === 'Cancelled'
    );
  }
  isStatusReached(status: string): boolean {
    if (!this.order) {
      return false;
    }
    const currentStatus = this.order.orderStatus;
    const statusOrder = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const requestedIndex = statusOrder.indexOf(status);
    if (currentIndex === -1 || requestedIndex === -1) {
      return false;
    }
    return (
      currentIndex >= requestedIndex
    );
  }
  openTrackingModal(): void {
    this.showTrackingModal = true;
    document.body.style.overflow = 'hidden';
  }
  closeTrackingModal(): void {
    this.showTrackingModal = false;
    document.body.style.overflow = '';
  }
  cancelOrder(): void {
    if (!this.order?._id) {
      return;
    }
    if (this.order.orderStatus !== 'Pending' && this.order.orderStatus !== 'Confirmed') {
      return;
    }
    this.router.navigate([
      '/cancel-order',
      this.order._id
    ]);
  }
  downloadInvoice(): void {
    if (!this.order) { return; }
    const doc = new jsPDF('p', 'mm', 'a4');
    const address = this.order.shippingAddress || {};
    const items = this.order.items || [];
    const companyName = 'PERFUME STORE';
    const companyAddress = 'Dubai, United Arab Emirates';
    const companyPhone = '+971 XX XXX XXXX';
    const companyEmail = 'support@perfumestore.com';
    const currency = 'AED';
    const dark: [number, number, number] = [35, 35, 35];
    const lightGray: [number, number, number] = [245, 245, 245];
    const borderGray: [number, number, number] = [210, 210, 210];
    const gray: [number, number, number] = [100, 100, 100];
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const left = 14;
    const right = pageWidth - 14;
    doc.setFillColor(dark[0], dark[1], dark[2]);
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(companyName, left, 16);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(companyAddress, left, 23);
    doc.text(`${companyPhone} | ${companyEmail}`, left, 29);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('TAX INVOICE', right, 18, { align: 'right' });
    doc.setTextColor(dark[0], dark[1], dark[2]);
    let y = 48;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Invoice Details', left, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    y += 8;
    const orderDate = this.order.createdAt ? new Date(this.order.createdAt).toLocaleDateString() : '-';
    const invoiceDate = new Date().toLocaleDateString();
    doc.text(`Invoice Number : INV-${this.order._id || 'ORDER'}`, left, y);
    doc.text(`Order ID : ${this.order._id || '-'}`, left, y + 6);
    doc.text(`Order Date : ${orderDate}`, 110, y);
    doc.text(`Invoice Date : ${invoiceDate}`, 110, y + 6);
    doc.text(`Payment Status : ${this.order.paymentStatus || '-'}`, 110, y + 12);
    y += 25;
    const boxHeight = 48;
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(left, y, 88, boxHeight, 2, 2, 'F');
    doc.roundedRect(108, y, 88, boxHeight, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('BILL TO', left + 5, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(address.fullName || '-', left + 5, y + 16);
    const billAddress = address.address || '-';
    const billLines = doc.splitTextToSize(billAddress, 76);
    doc.text(billLines, left + 5, y + 22);
    doc.text(`${address.city || '-'}, ${address.state || '-'}`, left + 5, y + 34);
    doc.text(`Pincode: ${address.pincode || '-'}`, left + 5, y + 40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('SHIP TO', 113, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(address.fullName || '-', 113, y + 16);
    const shipAddress = address.address || '-';
    const shipLines = doc.splitTextToSize(shipAddress, 76);
    doc.text(shipLines, 113, y + 22);
    doc.text(`${address.city || '-'}, ${address.state || '-'}`, 113, y + 34);
    doc.text(`Mobile: ${address.mobileNo || '-'}`, 113, y + 40);
    const rows = items.map((item: any, index: number) => {
      const price = Number(item.price || item.productPrice || 0);
      const quantity = Number(item.quantity || 0);
      const gross = price * quantity;
      const discount = Number(item.discount || 0);
      const taxable = gross - discount;
      const tax = Number(item.tax || 0);
      const total = Number(item.total || taxable + tax);
      return [
        index + 1,
        item.productName || '-',
        quantity,
        `${currency} ${price.toFixed(2)}`,
        `${currency} ${discount.toFixed(2)}`,
        `${currency} ${taxable.toFixed(2)}`,
        `${currency} ${tax.toFixed(2)}`,
        `${currency} ${total.toFixed(2)}`
      ];
    }
    ); y += boxHeight + 12;
    autoTable(doc,
      {
        startY: y,
        head: [['#',
          'Product',
          'Qty',
          'Price',
          'Discount',
          'Taxable',
          'Tax',
          'Total'
        ]],
        body: rows,
        theme: 'grid',
        margin: {
          left: 14,
          right: 14
        },
        styles: {
          fontSize: 8,
          cellPadding: 3,
          valign: 'middle',
          textColor: dark
        },
        headStyles: {
          fillColor: dark,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8
        },
        alternateRowStyles: {
          fillColor: lightGray
        },
        columnStyles: {
          0: {
            cellWidth: 8,
            halign: 'center'
          },
          1: {
            cellWidth: 48
          },
          2: {
            cellWidth: 12,
            halign: 'center'
          },
          3: {
            cellWidth: 22,
            halign: 'right'
          },
          4: {
            cellWidth: 22,
            halign: 'right'
          },
          5: {
            cellWidth: 22,
            halign: 'right'
          },
          6: {
            cellWidth: 20,
            halign: 'right'
          },
          7: {
            cellWidth: 25,
            halign: 'right'
          }
        }
      }
    );
    const subtotal = items.reduce((sum: number, item: any) => { const price = Number(item.price || item.productPrice || 0); const qty = Number(item.quantity || 0); return sum + (price * qty); }, 0);
    const discount = items.reduce((sum: number, item: any) => { return sum + Number(item.discount || 0); }, 0);
    const tax = items.reduce((sum: number, item: any) => { return sum + Number(item.tax || 0); }, 0);
    const grandTotal = Number(this.order.totalAmount || subtotal - discount + tax);
    let finalY = (doc as any).lastAutoTable.finalY + 10;
    if (finalY > pageHeight - 85) { doc.addPage(); finalY = 20; }
    const totalBoxX = 110;
    const totalBoxWidth = 86;
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.roundedRect(totalBoxX, finalY, totalBoxWidth, 58, 2, 2, 'S');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Subtotal', totalBoxX + 6, finalY + 10);
    doc.text(`${currency} ${subtotal.toFixed(2)}`, right - 6, finalY + 10, { align: 'right' });
    doc.text('Discount', totalBoxX + 6, finalY + 18);
    doc.text(`- ${currency} ${discount.toFixed(2)}`, right - 6, finalY + 18, { align: 'right' });
    doc.text('Tax', totalBoxX + 6, finalY + 26);
    doc.text(`${currency} ${tax.toFixed(2)}`, right - 6, finalY + 26, { align: 'right' });
    doc.text('Delivery', totalBoxX + 6, finalY + 34);
    doc.text('FREE', right - 6, finalY + 34, { align: 'right' });
    doc.setDrawColor(180, 180, 180);
    doc.line(totalBoxX + 5, finalY + 39, right - 5, finalY + 39);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('GRAND TOTAL', totalBoxX + 6, finalY + 50);
    doc.text(`${currency} ${grandTotal.toFixed(2)}`, right - 6, finalY + 50, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Payment Details', left, finalY + 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Payment Method : ${this.order.paymentMethod || '-'}`, left, finalY + 19);
    doc.text(`Payment Status : ${this.order.paymentStatus || '-'}`, left, finalY + 27);
    let footerY = finalY + 70;
    if (footerY > pageHeight - 35) { doc.addPage(); footerY = 25; }
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.line(left, footerY, right, footerY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Terms & Conditions', left, footerY + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Please retain this invoice for your records.', left, footerY + 15);
    doc.text('Returns and refunds are subject to our store policy.', left, footerY + 21);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Authorized Signatory', right, footerY + 20, { align: 'right' });
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.text('Thank you for shopping with Perfume Store!', pageWidth / 2, pageHeight - 12, { align: 'center' }); doc.save(`Invoice-${this.order._id || 'Order'}.pdf`);
  }

  // =====================================
// GET FIRST ORDER ITEM
// =====================================

getOrderItem(): any {
  return this.order?.items?.[0] || null;
}


getReturnStatus(): string {
  const item = this.getOrderItem();
  return item?.returnStatus || 'Not Returned';
}


canReturnProduct(): boolean {
  if (!this.order) {  return false; }
  if (this.order.orderStatus !== 'Delivered') {
    return false;
  }
  const item = this.getOrderItem();
  if (!item) {return false; }

  return (!item.returnStatus || item.returnStatus === 'Not Returned');
}
openReturnModal(): void {
  if (!this.canReturnProduct()) { return; }
  const item = this.getOrderItem();
  this.returnQuantity = 1;
  this.returnReason = '';
  this.returnDescription = '';
  this.returnMessage = '';
  this.returnError = '';
  if (item?.quantity) {
    this.returnQuantity = 1;
  }
  this.showReturnModal = true;
  document.body.style.overflow = 'hidden';
}
closeReturnModal(): void {
  if (this.returnLoading) {return;}
  this.showReturnModal = false;
  document.body.style.overflow = '';
}
submitReturn(): void {
  if (!this.order?._id) {
    this.returnError ='Order information not found.';
    return;
  }
  const item = this.getOrderItem();
  if (!item) {
    this.returnError ='Product information not found.';
      return;
  }
  if (!this.returnReason) {
    this.returnError = 'Please select a return reason.';
     return;
  }
  if (!this.returnQuantity || this.returnQuantity < 1 ) {
    this.returnError ='Please select a valid quantity.'; return;
  }

  if (this.returnQuantity > Number(item.quantity) ) {
    this.returnError =`Maximum return quantity is ${item.quantity}.`;
    return;
  }
  this.returnLoading = true;
  this.returnError = '';
  this.returnMessage = '';
  const userId = localStorage.getItem('userId') || this.order.userId?._id ||this.order.userId;
  if (!userId) {
    this.returnLoading = false;
    this.returnError ='User information not found.';
    return;
  }
  const requestBody = {

  userId: userId,

  orderId: this.order._id,

  productId:
    item.productId?._id ||
    item.productId,

  quantity:
    Number(this.returnQuantity),

  reason:
    this.returnReason,

  description:
    this.returnDescription || '',

  refundMethod:
    'UPI',

  upiId:
    this.refundUpiId.trim()

};
  // const requestBody = {
  //   userId: userId,
  //   orderId: this.order._id,
  //   productId:item.productId?._id ||  item.productId,
  //   quantity: Number(this.returnQuantity),
  //   reason: this.returnReason,
  //   description:  this.returnDescription || '',
  //   refundMethod:  this.order.paymentMethod === 'COD'  ? 'COD Refund'  : 'Original Payment Method'
  // };
  console.log( 'Return Request:', requestBody );
  this.http.post<any>(   `${this.returnApiUrl}/request`, requestBody, {   headers: this.getHeaders() } ) .subscribe({
    next: (res) => {
      console.log( 'Return Response:',  res);
      this.returnLoading = false;
      this.returnMessage = res?.message ||'Return request submitted successfully.';
      if (this.order?.items?.length) {
        this.order.items[0].returnStatus = 'Return Requested';
        this.order.items[0].returnQuantity = Number(this.returnQuantity); }
      this.cd.detectChanges();
      setTimeout(() => {
        this.showReturnModal = false;
        this.returnMessage = '';
        document.body.style.overflow = '';
        this.cd.detectChanges();
      }, 1500);
    },
    error: (err) => {
      console.error(  'Return request error:', err);
      this.returnLoading = false;
      this.returnError = err?.error?.message ||'Failed to submit return request.';
      this.cd.detectChanges();
    }
  });
}
getReturnStatusClass(): string {
  switch (this.getReturnStatus()) {
    case 'Return Requested':
      return 'return-requested';
    case 'Return Approved':
      return 'return-approved';
    case 'Return Rejected':
      return 'return-rejected';
    case 'Return Picked Up':
      return 'return-picked-up';
    case 'Returned':
      return 'returned';
    case 'Refund Processing':
      return 'refund-processing';
    case 'Refund Completed':
      return 'refund-completed';
    default:
      return 'return-not-requested';
  }
}
getPaymentStatus(): string {
  return this.order?.paymentStatus || 'Pending';
}

isPaymentPaid(): boolean {
  return this.getPaymentStatus().toLowerCase() === 'success';
}

isPaymentPending(): boolean {
  return this.getPaymentStatus().toLowerCase() === 'pending';
}

isPaymentFailed(): boolean {
  return this.getPaymentStatus().toLowerCase() === 'failed';
}

isPaymentRefunded(): boolean {
  return this.getPaymentStatus().toLowerCase() === 'refunded';
}
}