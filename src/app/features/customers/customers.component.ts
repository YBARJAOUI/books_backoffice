// ============= CUSTOMER LIST COMPONENT =============
// src/app/features/customers/customers.component.ts

import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../core/services/customer.service';
import { NotificationService } from '../../core/services/notification.service';
import { Customer } from '../../core/models/customer.interface';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  loading = false;
  showDialog = false;
  isEditMode = false;
  searchTerm = '';
  
  currentCustomer: Customer = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    isActive: true
  };

  constructor(
    private customerService: CustomerService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.notificationService.error('Error loading customers');
        this.loading = false;
      }
    });
  }

  searchCustomers() {
    if (this.searchTerm.trim()) {
      this.loading = true;
      this.customerService.searchCustomers(this.searchTerm).subscribe({
        next: (customers) => {
          this.customers = customers;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching customers:', error);
          this.notificationService.error('Error searching customers');
          this.loading = false;
        }
      });
    } else {
      this.loadCustomers();
    }
  }

  showNewCustomerDialog() {
    this.currentCustomer = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      isActive: true
    };
    this.isEditMode = false;
    this.showDialog = true;
  }

  editCustomer(customer: Customer) {
    this.currentCustomer = { ...customer };
    this.isEditMode = true;
    this.showDialog = true;
  }

  saveCustomer() {
    if (!this.validateCustomer()) {
      this.notificationService.error('Please fill in all required fields');
      return;
    }

    if (this.isEditMode) {
      this.customerService.updateCustomer(this.currentCustomer.id!, this.currentCustomer).subscribe({
        next: () => {
          this.notificationService.success('Customer updated successfully');
          this.showDialog = false;
          this.loadCustomers();
        },
        error: (error) => {
          console.error('Error updating customer:', error);
          this.notificationService.error('Error updating customer');
        }
      });
    } else {
      this.customerService.createCustomer(this.currentCustomer).subscribe({
        next: () => {
          this.notificationService.success('Customer created successfully');
          this.showDialog = false;
          this.loadCustomers();
        },
        error: (error) => {
          console.error('Error creating customer:', error);
          this.notificationService.error(error.error?.message || 'Error creating customer');
        }
      });
    }
  }

  deleteCustomer(customer: Customer) {
    if (confirm(`Are you sure you want to delete ${customer.firstName} ${customer.lastName}?`)) {
      this.customerService.deleteCustomer(customer.id!).subscribe({
        next: () => {
          this.notificationService.success('Customer deleted successfully');
          this.loadCustomers();
        },
        error: (error) => {
          console.error('Error deleting customer:', error);
          this.notificationService.error('Error deleting customer');
        }
      });
    }
  }

  toggleCustomerStatus(customer: Customer) {
    this.customerService.toggleCustomerStatus(customer.id!).subscribe({
      next: () => {
        this.notificationService.success('Customer status updated');
        this.loadCustomers();
      },
      error: (error) => {
        console.error('Error updating customer status:', error);
        this.notificationService.error('Error updating customer status');
      }
    });
  }

  validateCustomer(): boolean {
    return !!(
      this.currentCustomer.firstName &&
      this.currentCustomer.lastName &&
      this.currentCustomer.email &&
      this.currentCustomer.phoneNumber &&
      this.currentCustomer.address
    );
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'success' : 'danger';
  }
}



