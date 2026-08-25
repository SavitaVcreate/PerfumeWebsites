import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistCount = new BehaviorSubject<number>(0);
  wishlistCount$ = this.wishlistCount.asObservable();
  constructor() { }
  setWishlistCount(count: number) { this.wishlistCount.next(count); }

  getWishlistCount() { return this.wishlistCount.value; }
}