// // src/app/features/dashboard/dashboard.component.ts
// import { Component, OnInit } from '@angular/core';
// import { BookService } from '../../core/services/book.service';
// import { OrderService } from '../../core/services/order.service';
// import { CustomerService } from '../../core/services/customer.service';
// import { Book } from '../../core/models/book.interface';
// import { Order } from '../../core/models/order.interface';
// import { forkJoin } from 'rxjs';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.html',
//   styleUrls: ['./dashboard.scss']
// })
// export class DashboardComponent implements OnInit {
//   // Statistics
//   stats = {
//     totalBooks: 0,
//     availableBooks: 0,
//     totalCustomers: 0,
//     totalOrders: 0,
//     totalRevenue: 0,
//     pendingOrders: 0,
//     lowStockBooks: 0
//   };

//   // Recent data
//   recentOrders: Order[] = [];
//   recentBooks: Book[] = [];
//   lowStockBooks: Book[] = [];
  
//   loading = true;

//   constructor(
//     private bookService: BookService,
//     private orderService: OrderService,
//     private customerService: CustomerService
//   ) {}

//   ngOnInit() {
//     this.loadDashboardData();
//   }

//   loadDashboardData() {
//     this.loading = true;

//     // Charger les données des livres
//     this.bookService.getAllBooks({ page: 0, size: 1000 }).subscribe({
//       next: (booksPage: any) => {
//         this.stats.totalBooks = booksPage.totalElements;
//         this.stats.availableBooks = booksPage.content.filter((b: any) => b.isAvailable).length;
//         this.recentBooks = booksPage.content.slice(0, 5);
//       },
//       error: (error: any) => console.error('Erreur books:', error)
//     });

//     // Charger les livres avec stock faible
//     this.bookService.getLowStockBooks(10).subscribe({
//       next: (books: Book[]) => {
//         this.lowStockBooks = books;
//         this.stats.lowStockBooks = books.length;
//       },
//       error: (error: any) => console.error('Erreur low stock books:', error)
//     });

//     this.customerService.getActiveCustomers().subscribe({
//       next: (customers) => {
//         this.stats.totalCustomers = customers.length;
//       },
//       error: (error) => console.error('Erreur customers:', error)
//     });

//     this.orderService.getRecentOrders().subscribe({
//       next: (orders) => {
//         this.stats.totalOrders = orders.length;
//         this.stats.totalRevenue = orders
//           .filter(order => order.status !== 'CANCELLED')
//           .reduce((sum, order) => sum + order.totalAmount, 0);
//         this.stats.pendingOrders = orders
//           .filter(order => order.status === 'PENDING').length;
//         this.recentOrders = orders.slice(0, 5);
//         this.loading = false;
//       },
//       error: (error) => {
//         console.error('Erreur orders:', error);
//         this.loading = false;
//       }
//     });
//   }

//   getStatusBadgeClass(status: string): string {
//     const classes = {
//       'PENDING': 'bg-warning',
//       'CONFIRMED': 'bg-info',
//       'PROCESSING': 'bg-primary', 
//       'SHIPPED': 'bg-warning',
//       'DELIVERED': 'bg-success',
//       'CANCELLED': 'bg-danger'
//     };
//     return classes[status as keyof typeof classes] || 'bg-secondary';
//   }

//   getImageUrl(imagePath: string): string {
//     return this.bookService.getImageUrl(imagePath);
//   }
// }