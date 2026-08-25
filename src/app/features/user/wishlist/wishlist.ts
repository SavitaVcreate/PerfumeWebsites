import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Sidebar } from '../../../layouts/sidebar/sidebar';
import { WhichlistService } from '../../../core/services/whish-list/whichlist-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  imports: [Sidebar, CommonModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist implements OnInit {
  wishlist: any[] = [];
  showMessage = false;
  message = '';
  constructor(private wishist: WhichlistService, private cd: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.getWishlist();
  }
  getWishlist() {
    this.wishist.getWishlist().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.wishlist = res.data.filter((x: any) => x.productId != null);
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  removeWishlist(productId: string) {
    this.wishist.removeWishlist(productId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.wishlist = this.wishlist.filter(x => x.productId._id !== productId);
          this.message = res.message;
          this.showMessage = true;
          setTimeout(() => { this.showMessage = false; }, 5000);
        }
      },

      error: (err) => {
        this.message = err.error?.message || 'Failed to remove wishlist item.';
        this.showMessage = true;
        setTimeout(() => { this.showMessage = false; }, 5000);
      }
    });
  }
}
