import { Component } from '@angular/core';
import { Navbar } from "../../../../../layouts/navbar/navbar";
import { Footer } from "../../../../../layouts/footer/footer";

@Component({
  selector: 'app-refund-policy',
  imports: [Navbar, Footer],
  templateUrl: './refund-policy.html',
  styleUrl: './refund-policy.css',
})
export class RefundPolicy {}
