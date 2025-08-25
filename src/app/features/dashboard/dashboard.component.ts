// src/app/features/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { BookService } from '../../core/services/book.service';
import { OrderService } from '../../core/services/order.service';
import { CustomerService } from '../../core/services/customer.service';
import { Book } from '../../core/models/book.interface';
import { Order } from '../../core/models/order.interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
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

    // Charger les données de base
    this.bookService.getActiveBooks().subscribe({
      next: (books) => {
        this.stats.totalBooks = books.length;
        this.stats.lowStockBooks = books.filter(b => b.stockQuantity! <= 10).length;
        this.lowStockBooks = books.filter(b => b.stockQuantity! <= 10).slice(0, 5);
      },
      error: (error) => console.error('Erreur books:', error)
    });

    this.customerService.getActiveCustomers().subscribe({
      next: (customers) => {
        this.stats.totalCustomers = customers.length;
      },
      error: (error) => console.error('Erreur customers:', error)
    });

    this.orderService.getRecentOrders().subscribe({
      next: (orders) => {
        this.stats.totalOrders = orders.length;
        this.stats.totalRevenue = orders
          .filter(order => order.status !== 'CANCELLED')
          .reduce((sum, order) => sum + order.totalAmount, 0);
        this.stats.pendingOrders = orders
          .filter(order => order.status === 'PENDING').length;
        this.recentOrders = orders.slice(0, 5);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur orders:', error);
        this.loading = false;
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    const classes = {
      'PENDING': 'bg-warning',
      'CONFIRMED': 'bg-info',
      'PROCESSING': 'bg-primary', 
      'SHIPPED': 'bg-warning',
      'DELIVERED': 'bg-success',
      'CANCELLED': 'bg-danger'
    };
    return classes[status as keyof typeof classes] || 'bg-secondary';
  }
}