// src/app/features/books/book-detail/book-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Book } from '../../../core/models/book.interface';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.html',
  styleUrls: ['./book-detail.scss']
})
export class BookDetailComponent implements OnInit {
  book?: Book;
  loading = false;
  bookId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookId = +id;
      this.loadBook();
    }
  }

  loadBook() {
    this.loading = true;
    this.bookService.getBook(this.bookId).subscribe({
      next: (book: Book) => {
        this.book = book;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du livre:', error);
        this.notificationService.error('Erreur lors du chargement du livre');
        this.loading = false;
        this.router.navigate(['/books']);
      }
    });
  }

  editBook() {
    this.router.navigate(['/books/edit', this.book?.id]);
  }

  deleteBook() {
    if (!this.book) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer le livre "${this.book.title}" ?`)) {
      this.bookService.deleteBook(this.book.id!).subscribe({
        next: () => {
          this.notificationService.success('Livre supprimé avec succès');
          this.router.navigate(['/books']);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.notificationService.error('Erreur lors de la suppression');
        }
      });
    }
  }

  toggleFeatured() {
    if (!this.book) return;
    
    this.bookService.toggleFeatured(this.book.id!).subscribe({
      next: (updatedBook) => {
        this.book = updatedBook;
        const action = updatedBook.isFeatured ? 'ajouté aux' : 'retiré des';
        this.notificationService.success(`Livre ${action} favoris`);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        this.notificationService.error('Erreur lors de la mise à jour');
      }
    });
  }

  goBack() {
    this.router.navigate(['/books']);
  }

  getStockSeverity(stock: number): string {
    if (stock === 0) return 'danger';
    if (stock <= 10) return 'warning';
    if (stock <= 50) return 'info';
    return 'success';
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'text-success' : 'text-danger';
  }

  getLanguageLabel(language: string): string {
    const languageLabels: { [key: string]: string } = {
      'fr': 'Français',
      'en': 'Anglais',
      'es': 'Espagnol',
      'de': 'Allemand',
      'it': 'Italien',
      'other': 'Autre'
    };
    return languageLabels[language] || language;
  }
}