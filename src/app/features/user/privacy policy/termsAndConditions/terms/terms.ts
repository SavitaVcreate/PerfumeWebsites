import { Component } from '@angular/core';
import { Navbar } from "../../../../../layouts/navbar/navbar";
import { Footer } from "../../../../../layouts/footer/footer";

@Component({
  selector: 'app-terms',
  imports: [Navbar, Footer],
  templateUrl: './terms.html',
  styleUrl: './terms.css',
})
export class Terms {}
