import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/dashboard';
import { BookListComponent } from './features/books/book-list/book-list';
import { BookFormComponent } from './features/books/book-form/book-form';
import { CustomersComponent } from './features/customers/customers';
import { OrderListComponent } from './features/orders/order-list/order-list';
import { OrderDetailComponent } from './features/orders/order-detail/order-detail';
import { PacksComponent } from './features/packs/packs';
import { DailyOffersComponent } from './features/daily-offers/daily-offers';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      
      // Routes des livres
      { path: 'books', component: BookListComponent },
      { path: 'books/new', component: BookFormComponent },
      { path: 'books/edit/:id', component: BookFormComponent },
      
      // Routes des clients
      { path: 'customers', component: CustomersComponent },
      
      // Routes des commandes
      { path: 'orders', component: OrderListComponent },
      { path: 'orders/:id', component: OrderDetailComponent },
      
      // Routes des packs
      { path: 'packs', component: PacksComponent },
      
      // Routes des offres du jour
      { path: 'daily-offers', component: DailyOffersComponent },
      
      // Route de redirection pour les routes inconnues
      { path: '**', redirectTo: '/dashboard' }
    ]
  }
];