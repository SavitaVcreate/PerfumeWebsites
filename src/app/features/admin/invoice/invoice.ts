import { Component } from '@angular/core';
import { Adminnav } from '../adminLayouts/adminnav/adminnav';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-invoice',
  imports: [Adminnav,RouterOutlet],
  templateUrl: './invoice.html',
  styleUrl: './invoice.css',
})
export class Invoice {}
