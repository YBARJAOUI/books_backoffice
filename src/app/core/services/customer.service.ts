// src/app/core/services/customer.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Customer } from '../models/customer.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly endpoint = 'customers';

  constructor(private apiService: ApiService) {}

  getActiveCustomers(): Observable<Customer[]> {
    return this.apiService.get<Customer[]>(`${this.endpoint}/active`);
  }

  getAllCustomers(): Observable<Customer[]> {
    return this.apiService.get<Customer[]>(this.endpoint);
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.apiService.get<Customer>(`${this.endpoint}/${id}`);
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.apiService.post<Customer>(this.endpoint, customer);
  }

  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.apiService.put<Customer>(`${this.endpoint}/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}
