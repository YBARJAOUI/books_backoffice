// src/app/features/books/book-form/book-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ImageService } from '../../../core/services/image.service';
import { Book } from '../../../core/models/book.interface';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.html',
  styleUrls: ['./book-form.scss']
})
export class BookFormComponent implements OnInit {
  bookForm!: FormGroup;
  isEditMode = false;
  bookId?: number;
  loading = false;
  submitLoading = false;
  categories: string[] = [];
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  // Options pour les listes déroulantes
  languageOptions = [
    { label: 'Français', value: 'francais' },
    { label: 'Anglais', value: 'anglais' },
    { label: 'Arabe', value: 'arabe' }
  ];

  categoryOptions = [
    'Fiction',
    'Non-Fiction',
    'Science-Fiction',
    'Fantasy',
    'Romance',
    'Thriller',
    'Histoire',
    'Biographie',
    'Sciences',
    'Philosophie',
    'Art',
    'Cuisine',
    'Santé',
    'Business',
    'Informatique'
  ];

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private notificationService: NotificationService,
    private imageService: ImageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.loadCategories();
    this.checkEditMode();
  }

  initializeForm() {
    this.bookForm = this.fb.group({
      isbn: ['', [Validators.required, Validators.pattern(/^[0-9-]{10,17}$/)]],
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageBase64: [''],
      isAvailable: [true],
      language: ['francais', [Validators.required]],
      category: ['', [Validators.required]]
    });
  }

  checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.bookId = +id;
      this.loadBook();
    }
  }

  loadBook() {
    this.loading = true;
    this.bookService.getBook(this.bookId!).subscribe({
      next: (book: Book) => {
        this.bookForm.patchValue(book);
        if (book.imageBase64) {
          this.imagePreview = book.imageBase64;
        }
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

  async onSubmit() {
    if (this.bookForm.valid) {
      this.submitLoading = true;
      const bookData: Book = this.bookForm.value;

      if (this.selectedImage) {
        try {
          bookData.imageBase64 = await this.imageService.convertToBase64(this.selectedImage);
        } catch (error) {
          console.error('Erreur lors de la conversion de l\'image:', error);
          this.notificationService.error('Erreur lors de la conversion de l\'image');
          this.submitLoading = false;
          return;
        }
      }

      const operation = this.isEditMode 
        ? this.bookService.updateBook(this.bookId!, bookData)
        : this.bookService.createBook(bookData);

      operation.subscribe({
        next: (response) => {
          const action = this.isEditMode ? 'modifié' : 'créé';
          this.notificationService.success(`Livre ${action} avec succès`);
          this.router.navigate(['/books']);
        },
        error: (error) => {
          console.error('Erreur lors de la sauvegarde:', error);
          this.notificationService.error('Erreur lors de la sauvegarde');
          this.submitLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.notificationService.error('Veuillez corriger les erreurs du formulaire');
    }
  }

  onCancel() {
    this.router.navigate(['/books']);
  }

  onReset() {
    if (this.isEditMode) {
      this.loadBook();
    } else {
      this.bookForm.reset();
      this.bookForm.patchValue({
        isAvailable: true,
        price: 0,
        stock: 0,
        language: 'francais'
      });
      this.selectedImage = null;
      this.imagePreview = null;
    }
  }

  // Méthodes d'aide pour la validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.bookForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.bookForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      const errors = field.errors;
      
      if (errors['required']) return `${this.getFieldLabel(fieldName)} est obligatoire`;
      if (errors['minlength']) return `${this.getFieldLabel(fieldName)} doit contenir au moins ${errors['minlength'].requiredLength} caractères`;
      if (errors['maxlength']) return `${this.getFieldLabel(fieldName)} ne peut pas dépasser ${errors['maxlength'].requiredLength} caractères`;
      if (errors['min']) return `${this.getFieldLabel(fieldName)} doit être supérieur à ${errors['min'].min}`;
      if (errors['max']) return `${this.getFieldLabel(fieldName)} ne peut pas dépasser ${errors['max'].max}`;
      if (errors['pattern']) return `Format de ${this.getFieldLabel(fieldName)} invalide`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      isbn: 'ISBN',
      title: 'Titre',
      author: 'Auteur',
      description: 'Description',
      price: 'Prix',
      stock: 'Stock',
      imageBase64: 'Image',
      language: 'Langue',
      category: 'Catégorie'
    };
    return labels[fieldName] || fieldName;
  }

  private markFormGroupTouched() {
    Object.keys(this.bookForm.controls).forEach(field => {
      const control = this.bookForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  // Méthode pour générer un ISBN (exemple simple)
  generateISBN() {
    const isbn = '978' + Math.random().toString().substr(2, 10);
    this.bookForm.patchValue({ isbn });
  }

  // Méthodes utilitaires pour le template
  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  getMinYear(): number {
    return 1000;
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (this.imageService.validateImageFile(file)) {
        this.selectedImage = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.notificationService.error('Format d\'image non valide. Utilisez JPG, PNG, GIF ou WebP (max 5MB)');
        event.target.value = '';
      }
    }
  }

  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;
    this.bookForm.patchValue({ imageBase64: '' });
  }
}