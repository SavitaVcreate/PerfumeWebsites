import { Component } from '@angular/core';
import { Navbar } from "../../../../layouts/navbar/navbar";
import { Footer } from "../../../../layouts/footer/footer";

@Component({
  selector: 'app-privacypolicy',
  imports: [Navbar, Footer],
  templateUrl: './privacypolicy.html',
  styleUrl: './privacypolicy.css',
})
export class Privacypolicy {}
