// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';

// Application Components
import { AppComponent } from './app.component';
import { routes } from './app.routes';

// Layout Components
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { Header } from './layout/header/header';
import { Sidebar } from './layout/sidebar/sidebar';

// Feature Components
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { BookListComponent } from './features/books/book-list/book-list.component';
import { BookFormComponent } from './features/books/book-form/book-form.component';
import { BookDetailComponent } from './features/books/book-detail/book-detail.component';
import { OrderListComponent } from './features/orders/order-list/order-list.component';
import { OrderDetailComponent } from './features/orders/order-detail/order-detail.component';
import { PackListComponent } from './features/packs/pack-list/pack-list.component';
import { DailyOfferListComponent } from './features/daily-offers/daily-offer-list/daily-offer-list.component';
import { CustomerListComponent } from './features/customers/customers.component';

@NgModule({
  declarations: [
    AppComponent,
    
    // Layout
    MainLayoutComponent,
    Header,
    Sidebar,
    
    // Features
    DashboardComponent,
    BookListComponent,
    BookFormComponent,
    BookDetailComponent,
    CustomerListComponent,
    OrderListComponent,
    OrderDetailComponent,
    PackListComponent,
    DailyOfferListComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }