// src/app/features/books/book-list/book-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Book } from '../../../core/models/book.interface';
import { PagedResponse } from '../../../core/models/api-response.interface';
import { LazyLoadEvent } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.html',
  styleUrls: ['./book-list.scss']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  loading = false;
  totalRecords = 0;
  rows = 10;
  
  // Filters
  searchValue = '';
  selectedCategory = '';
  categories: string[] = [];

  constructor(
    private bookService: BookService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadBooks({ first: 0, rows: this.rows } as TableLazyLoadEvent);
  }

  loadBooks(event: TableLazyLoadEvent) {
    this.loading = true;
    const page = (event.first ?? 0) / (event.rows ?? this.rows);
    const size = event.rows ?? this.rows;

    this.bookService.getBooks(page, size).subscribe({
      next: (response: PagedResponse<Book>) => {
        this.books = response.content;
        this.totalRecords = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des livres:', error);
        this.notificationService.error('Erreur lors du chargement des livres');
        this.loading = false;
      }
    });
  }

  loadCategories() {
    this.bookService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    });
  }

  onSearchChange() {
    if (this.searchValue.trim()) {
      this.loading = true;
      this.bookService.searchBooks(this.searchValue).subscribe({
        next: (books) => {
          this.books = books;
          this.totalRecords = books.length;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors de la recherche:', error);
          this.notificationService.error('Erreur lors de la recherche');
          this.loading = false;
        }
      });
    } else {
      this.loadBooks({ first: 0, rows: this.rows } as TableLazyLoadEvent);
    }
  }

  onCategoryChange() {
    if (this.selectedCategory) {
      this.loading = true;
      this.bookService.getBooksByCategory(this.selectedCategory).subscribe({
        next: (books) => {
          this.books = books;
          this.totalRecords = books.length;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du filtrage:', error);
          this.notificationService.error('Erreur lors du filtrage');
          this.loading = false;
        }
      });
    } else {
      this.loadBooks({ first: 0, rows: this.rows } as TableLazyLoadEvent);
    }
  }

  clearFilters() {
    this.searchValue = '';
    this.selectedCategory = '';
    this.loadBooks({ first: 0, rows: this.rows } as TableLazyLoadEvent);
  }

  addBook() {
    this.router.navigate(['/books/new']);
  }

  editBook(book: Book) {
    this.router.navigate(['/books/edit', book.id]);
  }

  deleteBook(book: Book) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le livre "${book.title}" ?`)) {
      this.bookService.deleteBook(book.id!).subscribe({
        next: () => {
          this.notificationService.success('Livre supprimé avec succès');
          this.loadBooks({ first: 0, rows: this.rows } as TableLazyLoadEvent);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.notificationService.error('Erreur lors de la suppression');
        }
      });
    }
  }

  toggleFeatured(book: Book) {
    this.bookService.toggleFeatured(book.id!).subscribe({
      next: (updatedBook) => {
        const index = this.books.findIndex(b => b.id === book.id);
        if (index !== -1) {
          this.books[index] = updatedBook;
        }
        const action = updatedBook.isFeatured ? 'ajouté aux' : 'retiré des';
        this.notificationService.success(`Livre ${action} favoris`);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        this.notificationService.error('Erreur lors de la mise à jour');
      }
    });
  }

  getStockSeverity(stock: number): string {
    if (stock === 0) return 'danger';
    if (stock <= 10) return 'warning';
    if (stock <= 50) return 'info';
    return 'success';
  }

  getStatusSeverity(isActive: boolean): string {
    return isActive ? 'success' : 'danger';
  }

  exportExcel() {
    this.notificationService.info('Export en cours...');
    // Logique d'export à implémenter
  }
}