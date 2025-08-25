import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Order } from '../models/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly endpoint = 'orders';

  constructor(private apiService: ApiService) {}

  getRecentOrders(): Observable<Order[]> {
    return this.apiService.get<Order[]>(`${this.endpoint}?size=10`);
  }

  getAllOrders(): Observable<Order[]> {
    return this.apiService.get<Order[]>(this.endpoint);
  }

  getOrderById(id: number): Observable<Order> {
    return this.apiService.get<Order>(`${this.endpoint}/${id}`);
  }

  createOrder(order: any): Observable<Order> {
    return this.apiService.post<Order>(this.endpoint, order);
  }

  updateOrderStatus(id: number, status: string): Observable<Order> {
    return this.apiService.put<Order>(`${this.endpoint}/${id}/status?status=${status}`, {});
  }

  cancelOrder(id: number, reason?: string): Observable<Order> {
    const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
    return this.apiService.put<Order>(`${this.endpoint}/${id}/cancel${params}`, {});
  }
}