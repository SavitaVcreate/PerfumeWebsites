import { Component, AfterViewInit, ElementRef, ViewChild, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Adminnav } from '../adminLayouts/adminnav/adminnav';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chart, registerables } from 'chart.js';
import { Dashboardservice } from '../../../core/services/dashboard/dashboardservice';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order/order';
import { Pagination } from '../../../shared/components/pagination/pagination';
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, Adminnav, CommonModule, Pagination],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements AfterViewInit, OnInit {
  recentOrder: any[] = [];
  paginatedRecentOrders: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  pages: number[] = [];
  usersCount = 0;
  usersChart!: Chart;
  dashboard: any = {};
  chartData: any[] = [];
  activeStat = 'customers';
  selectedPeriod = 'thisWeek';
  chart!: Chart;
  @ViewChild('weeklyChart')
  weeklyChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('salesChart')
  salesChart!: ElementRef<HTMLCanvasElement>;
  totalCustomers = 0;
  totalProducts = 0;
  totalOrders = 0;
  constructor(private api: Dashboardservice, private cd: ChangeDetectorRef, private orderSrv: OrderService) { }
  ngOnInit(): void {
    this.loadRecentOrders();
    this.getDashboard();
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadChart(this.activeStat); this.loadUsersChart();
    });
  }
  createUsersChart(data: any[]) {
    if (this.usersChart) { this.usersChart.destroy(); }
    this.usersChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: data.map(x => x.label),
        datasets: [{
          data: data.map(x => x.count),
          borderColor: '#6f42c1',
          backgroundColor: 'rgba(111,66,193,.15)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        }, responsive: true,
        maintainAspectRatio: false
      }
    });
  }
  loadUsersChart() {
    this.api.getUsersLast30Minutes().subscribe({
      next: (res: any) => {
        this.usersCount = res.totalUsers;
        this.createUsersChart(res.chartData);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getDashboard() {
    this.api.getDashboard().subscribe({
      next: (res: any) => {
        this.dashboard = res.data;
        this.cd.detectChanges();
      },
      error: (err) => { console.log(err); }
    });
  }
  loadChart(type: string) {
    this.api.getChartDashboard(type, this.selectedPeriod).subscribe({
      next: (res: any) => {
        this.chartData = res.data;
        this.createChart(this.chartData);
      },
      error: (err) => { console.log(err); }
    });
  }
  createChart(chartData: any[]) {
    if (!this.weeklyChart) return;
    const ctx = this.weeklyChart.nativeElement.getContext('2d');
    if (!ctx) return;
    if (this.chart) { this.chart.destroy(); }
    const gradient = ctx.createLinearGradient(0, 0, 0, 350);
    gradient.addColorStop(0, 'rgba(227,174,37,.55)');
    gradient.addColorStop(1, 'rgba(227,174,37,.05)');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.map(x => x.day),
        datasets: [{
          label: this.activeStat,
          data: chartData.map(x => x.count),
          borderColor: '#E3AE25',
          backgroundColor: gradient,
          fill: true,
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#E3AE25',
          pointBorderWidth: 3,
          tension: .4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => { return `${this.activeStat} : ${context.raw}`; }
            }
          }
        },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true }
        }
      }
    });
  }
  loadRecentOrders() {
    this.orderSrv.getRecentOrders().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.recentOrder = res.orders;
          this.setupPagination();
        }
      },
      error: (err) => { console.log(err); }
    });
  }

  setupPagination() {
    this.totalPages = Math.ceil(this.recentOrder.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.changePage(1);
  }
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) { return; }
    this.currentPage = page;
    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedRecentOrders = this.recentOrder.slice(start, end);
  }
  changePeriod(period: string) {
    this.selectedPeriod = period;
    this.loadChart(this.activeStat);
  }
  setActiveStat(type: string) {
    this.activeStat = type;
    this.loadChart(type);
  }
  downloadPdf() {

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Dashboard Report", 14, 20);

    autoTable(doc, {
      head: [['Title', 'Value']],
      body: [
        ['Total Income', this.dashboard.totalIncome || 0],
        ['Total Orders', this.dashboard.totalOrders || 0],
        ['Pending Orders', this.dashboard.pendingOrders || 0],
        ['Delivered Orders', this.dashboard.deliveredOrders || 0],
        ['Cancelled Orders', this.dashboard.cancelledOrders || 0],
        ['Customers', this.dashboard.totalCustomers || 0],
        ['Products', this.dashboard.totalProducts || 0]
      ]
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Day', 'Count']],
      body: this.chartData.map(item => [
        item.day,
        item.count
      ])
    });

    doc.save('Dashboard.pdf');

  }

}

