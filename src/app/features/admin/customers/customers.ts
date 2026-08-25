import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Adminnav } from '../adminLayouts/adminnav/adminnav';
import { RouterModule } from '@angular/router';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend, LineController } from 'chart.js';
import { SignupService } from '../../../core/services/signup/signup-service';
import { CommonModule } from '@angular/common';
import { Dashboardservice } from '../../../core/services/dashboard/dashboardservice';
import { Pagination } from '../../../shared/components/pagination/pagination';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend, LineController);
@Component({
  selector: 'app-customers',
  imports: [Adminnav, RouterModule, CommonModule, Pagination],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers implements OnInit {
  customerChart: any;
  repeatCustomers = 0;
  shopVisitor = 0;
  conversionRate = 0;
  selectedPeriod = 'thisWeek';
  chartLabels: string[] = [];
  chartData: number[] = [];
  customers: any[] = [];
  paginatedCustomers: any[] = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  totalCustomers = 0;
  newCustomers = 0;
  activeCustomers = 0;
  statsCards: any[] = [];
  constructor(private authService: SignupService, private cd: ChangeDetectorRef, private dashboard: Dashboardservice) { }
  ngOnInit(): void {
    this.loadCustomers();
    this.loadDashboardChart();
  }
  loadCustomers() {
    this.authService.getAllProfiles().subscribe({
      next: (res: any) => {
        this.customers = res.data.filter((x: any) => x.role === 'User');
        this.totalCustomers = this.customers.length;
        this.activeCustomers = this.customers.filter((x: any) => x.status === true).length;
        const today = new Date();
        const last7Days = new Date();
        last7Days.setDate(today.getDate() - 7);
        const previous7Days = new Date();
        previous7Days.setDate(today.getDate() - 14);
        this.newCustomers = this.customers.filter((x: any) => new Date(x.createdAt) >= last7Days).length;
        const previousWeekCustomers = this.customers.filter((x: any) => {
          const created = new Date(x.createdAt);
          return created >= previous7Days && created < last7Days;
        }).length;
        let growthValue = 0;
        if (previousWeekCustomers > 0) {
          growthValue = ((this.newCustomers - previousWeekCustomers) / previousWeekCustomers) * 100;
        } else if (this.newCustomers > 0) {
          growthValue = 100;
        }
        growthValue = Number(growthValue.toFixed(1));
        this.statsCards = [{
          title: 'Total Customers',
          value: this.totalCustomers,
          growth: growthValue,
          footer: 'Last 7 Days'
        },
        {
          title: 'New Customers',
          value: this.newCustomers,
          growth: growthValue,
          footer: 'Last 7 Days'
        },

        {
          title: 'Active Customers',
          value: this.activeCustomers,
          growth: growthValue,
          footer: 'Current Active'
        }
        ];
        this.totalPages = Math.ceil(this.customers.length / this.pageSize);
        this.setPage(1);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  // loadCustomers() {
  //   this.authService.getAllProfiles().subscribe({
  //     next: (res: any) => {

  //       this.customers = res.data.filter(
  //         (x: any) => x.role === 'User'
  //       );

  //       this.totalCustomers = this.customers.length;

  //       this.activeCustomers = this.customers.filter(
  //         (x: any) => x.status
  //       ).length;

  //       const sevenDaysAgo = new Date();
  //       sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  //       this.newCustomers = this.customers.filter(
  //         (x: any) => new Date(x.createdAt) >= sevenDaysAgo
  //       ).length;

  //       this.totalPages = Math.ceil(
  //         this.customers.length / this.pageSize
  //       );

  //       this.setPage(1);

  //       this.cd.detectChanges();

  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   });
  // }
  loadDashboardChart() {
    this.dashboard.getCustomerDashboard(this.selectedPeriod).subscribe({
      next: (res: any) => {
        debugger
        this.activeCustomers = res.data.activeCustomers;
        this.repeatCustomers = res.data.repeatCustomers;
        this.shopVisitor = res.data.shopVisitor;
        this.conversionRate = res.data.conversionRate;
        this.chartLabels = res.data.chart.map((x: any) => x.day);
        this.chartData = res.data.chart.map((x: any) => x.count);
        this.createChart();
      }
    });
  }
  changePeriod(period: string) {
    this.selectedPeriod = period;
    this.loadDashboardChart();
  }
  setPage(page: number) {
    if (page < 1 || page > this.totalPages) { return; }
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedCustomers = this.customers.slice(start, end);
  }
  nextPage() {
    if (this.currentPage < this.totalPages) { this.setPage(this.currentPage + 1); }
  }

  previousPage() {
    if (this.currentPage > 1) { this.setPage(this.currentPage - 1); }
  }
  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }
  createChart(): void {
    const canvas = document.getElementById('customerChart') as HTMLCanvasElement;
    if (!canvas) return;
    if (this.customerChart) { this.customerChart.destroy(); }
    this.customerChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [
          {
            label: 'Customers',
            data: this.chartData,
            borderColor: '#D4A017',
            backgroundColor: (context: any) => {
              const chart = context.chart; const { ctx, chartArea } = chart;
              if (!chartArea) { return '#F4C542'; }
              const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              gradient.addColorStop(0, 'rgba(212,160,23,.45)');
              gradient.addColorStop(.5, 'rgba(212,160,23,.18)');
              gradient.addColorStop(1, 'rgba(212,160,23,.02)');
              return gradient;
            },
            fill: true,
            tension: .45,
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#D4A017',
            pointBorderColor: '#fff',
            pointBorderWidth: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}