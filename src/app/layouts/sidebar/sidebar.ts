import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  user: any = {};
ngOnInit(): void {
   const userData = localStorage.getItem('user');
  if (userData) {
    this.user = JSON.parse(userData);
  }
}
}