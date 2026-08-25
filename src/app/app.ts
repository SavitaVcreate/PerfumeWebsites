import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Modal } from './layouts/modal/modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Modal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('PerfumeWebsites');
}
