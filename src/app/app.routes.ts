import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { BookListComponent } from './features/books/book-list/book-list.component';
import { BookFormComponent } from './features/books/book-form/book-form.component';
import { CustomerListComponent } from './features/customers/customers.component';
import { OrderListComponent } from './features/orders/order-list/order-list.component';
import { OrderDetailComponent } from './features/orders/order-detail/order-detail.component';
import { PackListComponent } from './features/packs/pack-list/pack-list.component';
import { DailyOfferListComponent } from './features/daily-offers/daily-offer-list/daily-offer-list.component';

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
      { path: 'customers', component: CustomerListComponent },
      
      // Routes des commandes
      { path: 'orders', component: OrderListComponent },
      { path: 'orders/:id', component: OrderDetailComponent },
      
      // Routes des packs
      { path: 'packs', component: PackListComponent },
      
      // Routes des offres du jour
      { path: 'daily-offers', component: DailyOfferListComponent },
      
      // Route de redirection pour les routes inconnues
      { path: '**', redirectTo: '/dashboard' }
    ]
  }
];