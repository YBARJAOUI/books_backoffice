
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

  getAllCustomers(): Observable<Customer[]> {
    return this.apiService.get<Customer[]>(this.endpoint);
  }

  getActiveCustomers(): Observable<Customer[]> {
    return this.apiService.get<Customer[]>(`${this.endpoint}/active`);
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

  searchCustomers(keyword: string): Observable<Customer[]> {
    const params = { keyword };
    return this.apiService.get<Customer[]>(`${this.endpoint}/search`, params);
  }

  toggleCustomerStatus(id: number): Observable<Customer> {
    return this.apiService.put<Customer>(`${this.endpoint}/${id}/toggle-status`, {});
  }

  getCustomersByCity(city: string): Observable<Customer[]> {
    return this.apiService.get<Customer[]>(`${this.endpoint}/city/${city}`);
  }

  getCustomerStatistics(): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/statistics`);
  }
}