// src/app/features/books/book-list/book-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
// import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    // SelectModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class BookListComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  books: Book[] = [];
  loading = true;
  totalRecords = 0;
  rows = 10;
  first = 0;

  // Filters
  categories: string[] = [];
  selectedCategory: string = '';
  searchValue: string = '';

  // Table columns
  cols = [
    { field: 'imageUrl', header: 'Image' },
    { field: 'title', header: 'Titre' },
    { field: 'author', header: 'Auteur' },
    { field: 'category', header: 'Catégorie' },
    { field: 'price', header: 'Prix' },
    { field: 'stockQuantity', header: 'Stock' },
    { field: 'isActive', header: 'Statut' },
    { field: 'actions', header: 'Actions' }
  ];

  constructor(
    private bookService: BookService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadBooks();
    this.loadCategories();
  }

  loadBooks(event?: any) {
    this.loading = true;

    const page = event ? event.first / event.rows : 0;
    const size = event ? event.rows : this.rows;

    this.bookService.getBooks(page, size).subscribe({
      next: (response) => {
        this.books = response.content;
        this.totalRecords = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des livres:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les livres'
        });
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
      this.bookService.searchBooks(this.searchValue).subscribe({
        next: (books) => {
          this.books = books;
          this.totalRecords = books.length;
        },
        error: (error) => {
          console.error('Erreur lors de la recherche:', error);
        }
      });
    } else {
      this.loadBooks();
    }
  }

  onCategoryChange() {
    if (this.selectedCategory) {
      this.bookService.getBooksByCategory(this.selectedCategory).subscribe({
        next: (books) => {
          this.books = books;
          this.totalRecords = books.length;
        },
        error: (error) => {
          console.error('Erreur lors du filtrage par catégorie:', error);
        }
      });
    } else {
      this.loadBooks();
    }
  }

  clearFilters() {
    this.searchValue = '';
    this.selectedCategory = '';
    this.table.clear();
    this.loadBooks();
  }

  addBook() {
    this.router.navigate(['/books/new']);
  }

  editBook(book: Book) {
    this.router.navigate(['/books/edit', book.id]);
  }

  deleteBook(book: Book) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le livre "${book.title}" ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => {
        this.bookService.deleteBook(book.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Livre supprimé avec succès'
            });
            this.loadBooks();
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Impossible de supprimer le livre'
            });
          }
        });
      }
    });
  }

  toggleFeatured(book: Book) {
    this.bookService.toggleFeatured(book.id!).subscribe({
      next: (updatedBook) => {
        const index = this.books.findIndex(b => b.id === book.id);
        if (index !== -1) {
          this.books[index] = updatedBook;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: `Livre ${updatedBook.isFeatured ? 'ajouté aux' : 'retiré des'} favoris`
        });
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de mettre à jour le livre'
        });
      }
    });
  }

  updateStock(book: Book, newStock: number) {
    this.bookService.updateStock(book.id!, newStock).subscribe({
      next: (updatedBook) => {
        const index = this.books.findIndex(b => b.id === book.id);
        if (index !== -1) {
          this.books[index] = updatedBook;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Stock mis à jour avec succès'
        });
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du stock:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de mettre à jour le stock'
        });
      }
    });
  }

  getStockSeverity(stock: number): string {
    if (stock === 0) return 'danger';
    if (stock <= 10) return 'warning';
    return 'success';
  }

  getStatusSeverity(isActive: boolean): string {
    return isActive ? 'success' : 'danger';
  }

  exportExcel() {
    // TODO: Implémenter l'export Excel
    this.messageService.add({
      severity: 'info',
      summary: 'Information',
      detail: 'Export Excel en cours de développement'
    });
  }
}