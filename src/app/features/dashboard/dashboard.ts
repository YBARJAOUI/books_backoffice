// src/app/features/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { BookService } from '../../core/services/book.service';
import { OrderService } from '../../core/services/order.service';
import { CustomerService } from '../../core/services/customer.service';
import { Book } from '../../core/models/book.interface';
import { Order } from '../../core/models/order.interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  imports: [CommonModule, RouterModule, BaseChartDirective]
})
export class DashboardComponent implements OnInit {
  // Statistics
  stats = {
    totalBooks: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockBooks: 0,
    pendingOrders: 0
  };

  // Charts data
  revenueChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{
      label: 'Revenus mensuels',
      data: [],
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      tension: 0.4
    }]
  };

  ordersChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['En attente', 'Confirmées', 'Expédiées', 'Livrées', 'Annulées'],
    datasets: [{
      data: [],
      backgroundColor: [
        '#ffc107',
        '#17a2b8', 
        '#fd7e14',
        '#28a745',
        '#dc3545'
      ]
    }]
  };

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  // Recent data
  recentOrders: Order[] = [];
  lowStockBooks: Book[] = [];
  
  loading = true;

  constructor(
    private bookService: BookService,
    private orderService: OrderService,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;

    forkJoin({
      books: this.bookService.getActiveBooks(),
      customers: this.customerService.getActiveCustomers(),
      orders: this.orderService.getRecentOrders(),
      lowStock: this.bookService.getLowStockBooks(10)
    }).subscribe({
      next: (data) => {
        this.processStatistics(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du dashboard:', error);
        this.loading = false;
      }
    });
  }

  private processStatistics(data: any) {
    this.stats.totalBooks = data.books.length;
    this.stats.totalCustomers = data.customers.length;
    this.stats.totalOrders = data.orders.length;
    this.stats.lowStockBooks = data.lowStock.length;
    
    // Calculate revenue and pending orders
    this.stats.totalRevenue = data.orders
      .filter((order: Order) => order.status !== 'CANCELLED')
      .reduce((sum: number, order: Order) => sum + order.totalAmount, 0);
      
    this.stats.pendingOrders = data.orders
      .filter((order: Order) => order.status === 'PENDING').length;

    this.recentOrders = data.orders.slice(0, 5);
    this.lowStockBooks = data.lowStock.slice(0, 5);

    this.setupCharts(data.orders);
  }

  private setupCharts(orders: Order[]) {
    // Setup revenue chart (mock monthly data)
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'];
    const revenues = [12000, 19000, 15000, 25000, 22000, 30000];
    
    this.revenueChartData.labels = months;
    this.revenueChartData.datasets[0].data = revenues;

    // Setup orders status chart
    const statusCounts = {
      PENDING: 0,
      CONFIRMED: 0, 
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0
    };

    orders.forEach(order => {
      statusCounts[order.status as keyof typeof statusCounts]++;
    });

    this.ordersChartData.datasets[0].data = [
      statusCounts.PENDING,
      statusCounts.CONFIRMED,
      statusCounts.SHIPPED, 
      statusCounts.DELIVERED,
      statusCounts.CANCELLED
    ];
  }

  getStatusBadgeClass(status: string): string {
    const classes = {
      'PENDING': 'badge-warning',
      'CONFIRMED': 'badge-info',
      'PROCESSING': 'badge-primary', 
      'SHIPPED': 'badge-warning',
      'DELIVERED': 'badge-success',
      'CANCELLED': 'badge-danger'
    };
    return classes[status as keyof typeof classes] || 'badge-secondary';
  }
}