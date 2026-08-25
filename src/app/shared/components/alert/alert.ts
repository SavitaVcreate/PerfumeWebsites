import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertData, AlertService } from '../../../core/services/alert/alertservice';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert implements OnInit, OnDestroy {
  alert: AlertData | null = null;

  private subscription?: Subscription;
  constructor(private alertService: AlertService) { }
  ngOnInit(): void {
    this.subscription =
      this.alertService.alert$.subscribe(
        (alert) => {
          this.alert = alert;

        }
      );
  }
  close(): void {
    this.alertService.clear();
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}