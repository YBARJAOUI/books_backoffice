import { Book } from "./book.interface";
import { Order } from "./order";

export interface DashboardStats {
  totalBooks: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockBooks: number;
  pendingOrders: number;
  monthlyRevenue: number[];
  topSellingBooks: Book[];
  recentOrders: Order[];
}
