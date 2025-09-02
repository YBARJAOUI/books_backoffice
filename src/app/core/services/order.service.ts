import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Order, OrderStatus, PaymentStatus } from '../models/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly endpoint = 'orders';

  constructor(private apiService: ApiService) {}

  getAllOrders(): Observable<Order[]> {
    return this.apiService.get<Order[]>(this.endpoint);
  }

  getOrderById(id: number): Observable<Order> {
    return this.apiService.get<Order>(`${this.endpoint}/${id}`);
  }

  createOrder(orderData: any): Observable<Order> {
    return this.apiService.post<Order>(this.endpoint, orderData);
  }

  updateOrderStatus(id: number, status: OrderStatus): Observable<Order> {
    return this.apiService.put<Order>(`${this.endpoint}/${id}/status?status=${status}`, {});
  }

  updatePaymentStatus(id: number, status: PaymentStatus): Observable<Order> {
    return this.apiService.put<Order>(`${this.endpoint}/${id}/payment-status?paymentStatus=${status}`, {});
  }

  cancelOrder(id: number, reason?: string | null): Observable<Order> {
    const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
    return this.apiService.put<Order>(`${this.endpoint}/${id}/cancel${params}`, {});
  }

  getOrdersByStatus(status: OrderStatus): Observable<Order[]> {
    return this.apiService.get<Order[]>(`${this.endpoint}/status/${status}`);
  }

  getCustomerOrders(customerId: number): Observable<Order[]> {
    return this.apiService.get<Order[]>(`${this.endpoint}/customer/${customerId}`);
  }
}
