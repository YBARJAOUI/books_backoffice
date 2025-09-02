// src/app/features/books/book-list/book-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Book } from '../../../core/models/book.interface';
import { PagedResponse } from '../../../core/models/api-response.interface';
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

  constructor(
    private bookService: BookService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
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

  clearFilters() {
    this.searchValue = '';
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

  toggleAvailability(book: Book) {
    this.bookService.toggleAvailability(book.id!).subscribe({
      next: (updatedBook) => {
        const index = this.books.findIndex(b => b.id === book.id);
        if (index !== -1) {
          this.books[index] = updatedBook;
        }
        const status = updatedBook.isAvailable ? 'disponible' : 'indisponible';
        this.notificationService.success(`Livre marqué comme ${status}`);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        this.notificationService.error('Erreur lors de la mise à jour');
      }
    });
  }

  getAvailabilitySeverity(isAvailable: boolean): string {
    return isAvailable ? 'success' : 'danger';
  }

  getImageUrl(imagePath: string): string {
    return this.bookService.getImageUrl(imagePath);
  }

  getLanguageLabel(language: string): string {
    const labels: { [key: string]: string } = {
      'francais': 'Français',
      'anglais': 'Anglais',
      'arabe': 'Arabe'
    };
    return labels[language] || language;
  }

  getLanguageBadgeClass(language: string): string {
    const classes: { [key: string]: string } = {
      'francais': 'bg-primary',
      'anglais': 'bg-success', 
      'arabe': 'bg-warning text-dark'
    };
    return classes[language] || 'bg-secondary';
  }

  exportExcel() {
    this.notificationService.info('Export en cours...');
    // Logique d'export à implémenter
  }
}