import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './adminLayouts/sidebar/sidebar';
import { Adminnav } from './adminLayouts/adminnav/adminnav';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ RouterOutlet,CommonModule,Sidebar],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  isSidenavOpen = true;
  
  toggleNav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}