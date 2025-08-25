import { Book } from "./book";
import { Customer } from "./customer.interface";

export interface Order {
  id?: number;
  orderNumber?: string;
  customer: Customer;
  orderItems: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  shippingAddress?: string;
  createdAt?: Date;
  updatedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}
export interface OrderItem {
  id?: number;
  book: Book;
  quantity: number;
  price: number;
  bookTitle?: string;
  bookAuthor?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}
