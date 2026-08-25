import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css'
})
export class Pagination {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 0;
  @Output() pageChange = new EventEmitter<number>();
  get pages(): number[] { return Array.from({ length: this.totalPages }, (_, index) => index + 1); }

  previousPage(): void {
    if (this.currentPage > 1) { this.pageChange.emit(this.currentPage - 1); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.pageChange.emit(this.currentPage + 1); }
  }
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.pageChange.emit(page);
  }
}