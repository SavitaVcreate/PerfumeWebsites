import { Component } from '@angular/core';
import { Navbar } from "../../../layouts/navbar/navbar";
import { Footer } from "../../../layouts/footer/footer";

@Component({
  selector: 'app-stores',
  imports: [Navbar, Footer],
  templateUrl: './stores.html',
  styleUrl: './stores.css',
})
export class Stores {}
