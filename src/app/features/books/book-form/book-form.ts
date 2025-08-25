// src/app/features/books/book-form/book-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book.interface';
import { NotificationService } from '../../../core/services/notification.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.html',
  styleUrls: ['./book-form.scss']
})
export class BookFormComponent implements OnInit {
  bookForm!: FormGroup;
  isEditMode = false;
  bookId: number | null = null;
  loading = false;
  submitLoading = false;
  
  categories: string[] = [];
  languages = ['Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien', 'Autre'];
  
  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private messageService: MessageService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadCategories();
    this.checkEditMode();
  }

  private initForm() {
    this.bookForm = this.fb.group({
      isbn: ['', [Validators.required, Validators.pattern(/^[\d\-X]+$/)]],
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: [''],
      price: ['', [Validators.required, Validators.min(0.01)]],
      stockQuantity: ['', [Validators.required, Validators.min(0)]],
      category: [''],
      publisher: [''],
      publicationYear: ['', [Validators.min(1000), Validators.max(new Date().getFullYear())]],
      language: [''],
      pageCount: ['', [Validators.min(1)]],
      imageUrl: ['', [Validators.pattern(/^https?:\/\/.+/)]],
      isActive: [true],
      isFeatured: [false]
    });
  }

  private checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.bookId = parseInt(id);
      this.loadBookData();
    }
  }

  private loadBookData() {
    if (!this.bookId) return;

    this.loading = true;
    this.bookService.getBook(this.bookId).subscribe({
      next: (book) => {
        this.bookForm.patchValue(book);
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('Impossible de charger les données du livre');
        this.loading = false;
        this.router.navigate(['/books']);
      }
    });
  }

  private loadCategories() {
    this.bookService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        this.notificationService.warning('Impossible de charger les catégories');
      }
    });
  }

  onSubmit() {
    if (this.bookForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.submitLoading = true;
    const bookData: Book = this.bookForm.value;

    const operation = this.isEditMode 
      ? this.bookService.updateBook(this.bookId!, bookData)
      : this.bookService.createBook(bookData);

    operation.subscribe({
      next: (book) => {
        this.notificationService.success(`Livre ${this.isEditMode ? 'modifié' : 'créé'} avec succès`);
        
        setTimeout(() => {
          this.router.navigate(['/books']);
        }, 1000);
      },
      error: (error) => {
        this.notificationService.error(error.message || `Impossible de ${this.isEditMode ? 'modifier' : 'créer'} le livre`);
        this.submitLoading = false;
      }
    });
  }

  onCancel() {
    this.router.navigate(['/books']);
  }

  private markFormGroupTouched() {
    Object.keys(this.bookForm.controls).forEach(key => {
      const control = this.bookForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters pour faciliter l'accès aux contrôles du formulaire
  get f() { return this.bookForm.controls; }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.bookForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.bookForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} est obligatoire`;
      if (field.errors['minlength']) return `${fieldName} est trop court`;
      if (field.errors['maxlength']) return `${fieldName} est trop long`;
      if (field.errors['min']) return `${fieldName} doit être supérieur à ${field.errors['min'].min}`;
      if (field.errors['max']) return `${fieldName} doit être inférieur à ${field.errors['max'].max}`;
      if (field.errors['pattern']) return `Format de ${fieldName} invalide`;
    }
    return '';
  }

  onImagePreview(event: any) {
    const url = event.target.value;
    if (url) {
      // Vérifier si l'URL est valide en créant un élément image
      const img = new Image();
      img.onload = () => {
        // L'image est valide
        this.messageService.add({
          severity: 'success',
          summary: 'Image valide',
          detail: 'L\'image a été chargée avec succès'
        });
      };
      img.onerror = () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Image invalide',
          detail: 'L\'URL de l\'image n\'est pas accessible'
        });
      };
      img.src = url;
    }
  }

  generateISBN() {
    // Générer un ISBN-13 factice pour les tests
    const isbn = '978' + Math.floor(Math.random() * 1000000000);
    this.bookForm.patchValue({ isbn });
  }
}