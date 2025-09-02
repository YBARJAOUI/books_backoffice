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

  toggleAvailability() {
    if (!this.book) return;
    
    this.bookService.toggleAvailability(this.book.id!).subscribe({
      next: (updatedBook) => {
        this.book = updatedBook;
        const status = updatedBook.isAvailable ? 'disponible' : 'indisponible';
        this.notificationService.success(`Livre marqué comme ${status}`);
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
}