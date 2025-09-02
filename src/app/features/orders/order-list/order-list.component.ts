// ============= ORDER LIST COMPONENT =============
// src/app/features/orders/order-list/order-list.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { CustomerService } from '../../../core/services/customer.service';
import { BookService } from '../../../core/services/book.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Order, OrderStatus, PaymentStatus } from '../../../core/models/order.interface';
import { Customer } from '../../../core/models/customer.interface';
import { Book } from '../../../core/models/book.interface';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  selectedOrder?: Order;
  showCreateDialog = false;
  showDetailDialog = false;
  
  // For new order
  customers: Customer[] = [];
  books: Book[] = [];
  newOrder = {
    customerId: null as number | null,
    items: [] as any[],
    shippingAddress: '',
    notes: ''
  };
  
  selectedBooks: any[] = [];
  
  orderStatuses = Object.values(OrderStatus);
  paymentStatuses = Object.values(PaymentStatus);
  
  // Filter
  statusFilter = '';

  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private bookService: BookService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadOrders();
    this.loadCustomers();
    this.loadBooks();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.notificationService.error('Error loading orders');
        this.loading = false;
      }
    });
  }

  loadCustomers() {
    this.customerService.getActiveCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
      }
    });
  }

  loadBooks() {
    this.bookService.getActiveBooks().subscribe({
      next: (books) => {
        this.books = books;
      },
      error: (error) => {
        console.error('Error loading books:', error);
      }
    });
  }

  showNewOrderDialog() {
    this.newOrder = {
      customerId: null,
      items: [],
      shippingAddress: '',
      notes: ''
    };
    this.selectedBooks = [];
    this.showCreateDialog = true;
  }

  createOrder() {
    if (!this.newOrder.customerId) {
      this.notificationService.error('Please select a customer');
      return;
    }

    if (this.selectedBooks.length === 0) {
      this.notificationService.error('Please add at least one book');
      return;
    }

    const orderData = {
      customerId: this.newOrder.customerId,
      items: this.selectedBooks.map(item => ({
        bookId: item.book.id,
        quantity: item.quantity
      })),
      shippingAddress: this.newOrder.shippingAddress,
      notes: this.newOrder.notes
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (order) => {
        this.notificationService.success('Order created successfully');
        this.showCreateDialog = false;
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.notificationService.error('Error creating order');
      }
    });
  }

  addBookToOrder() {
    this.selectedBooks.push({
      book: null,
      quantity: 1
    });
  }

  removeBookFromOrder(index: number) {
    this.selectedBooks.splice(index, 1);
  }

  calculateOrderTotal(): number {
    return this.selectedBooks.reduce((total, item) => {
      if (item.book && item.quantity) {
        return total + (item.book.price * item.quantity);
      }
      return total;
    }, 0);
  }

  viewOrderDetails(order: Order) {
    this.selectedOrder = order;
    this.showDetailDialog = true;
  }

  updateOrderStatus(order: Order, newStatus: OrderStatus) {
    this.orderService.updateOrderStatus(order.id!, newStatus).subscribe({
      next: (updatedOrder) => {
        this.notificationService.success('Order status updated');
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.notificationService.error('Error updating status');
      }
    });
  }

  updatePaymentStatus(order: Order, newStatus: PaymentStatus) {
    this.orderService.updatePaymentStatus(order.id!, newStatus).subscribe({
      next: (updatedOrder) => {
        this.notificationService.success('Payment status updated');
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error updating payment status:', error);
        this.notificationService.error('Error updating payment status');
      }
    });
  }

  cancelOrder(order: Order) {
    if (confirm(`Are you sure you want to cancel order ${order.orderNumber}?`)) {
      const reason = prompt('Cancellation reason (optional):');
      this.orderService.cancelOrder(order.id!, reason).subscribe({
        next: () => {
          this.notificationService.success('Order cancelled successfully');
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          this.notificationService.error('Error cancelling order');
        }
      });
    }
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'PENDING': 'warning',
      'CONFIRMED': 'info',
      'PROCESSING': 'info',
      'SHIPPED': 'warning',
      'DELIVERED': 'success',
      'CANCELLED': 'danger'
    };
    return classes[status] || 'secondary';
  }

  getPaymentStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'PENDING': 'warning',
      'PAID': 'success',
      'FAILED': 'danger',
      'REFUNDED': 'info'
    };
    return classes[status] || 'secondary';
  }

  filterOrders() {
    if (!this.statusFilter) {
      this.loadOrders();
    } else {
      this.loading = true;
      this.orderService.getOrdersByStatus(this.statusFilter as OrderStatus).subscribe({
        next: (orders) => {
          this.orders = orders;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error filtering orders:', error);
          this.notificationService.error('Error filtering orders');
          this.loading = false;
        }
      });
    }
  }
}


