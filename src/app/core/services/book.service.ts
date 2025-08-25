// src/app/core/services/book.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Book } from '../models/book.interface';
import { PagedResponse } from '../models/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly endpoint = 'books';

  constructor(private apiService: ApiService) {}

  // Récupérer tous les livres avec pagination
  getBooks(page = 0, size = 10): Observable<PagedResponse<Book>> {
    const params = {
      page: page.toString(),
      size: size.toString()
    };
    return this.apiService.get<PagedResponse<Book>>(this.endpoint, params);
  }

  // Récupérer tous les livres actifs
  getActiveBooks(): Observable<Book[]> {
    return this.apiService.get<Book[]>(`${this.endpoint}/active`);
  }

  // Récupérer un livre par ID
  getBook(id: number): Observable<Book> {
    return this.apiService.get<Book>(`${this.endpoint}/${id}`);
  }

  // Créer un nouveau livre
  createBook(book: Book): Observable<Book> {
    return this.apiService.post<Book>(this.endpoint, book);
  }

  // Mettre à jour un livre
  updateBook(id: number, book: Book): Observable<Book> {
    return this.apiService.put<Book>(`${this.endpoint}/${id}`, book);
  }

  // Supprimer un livre
  deleteBook(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  // Rechercher des livres
  searchBooks(keyword: string): Observable<Book[]> {
    const params = { keyword };
    return this.apiService.get<Book[]>(`${this.endpoint}/search`, params);
  }

  // Récupérer les livres par catégorie
  getBooksByCategory(category: string): Observable<Book[]> {
    return this.apiService.get<Book[]>(`${this.endpoint}/category/${category}`);
  }

  // Récupérer les livres en vedette
  getFeaturedBooks(): Observable<Book[]> {
    return this.apiService.get<Book[]>(`${this.endpoint}/featured`);
  }

  // Récupérer les catégories
  getCategories(): Observable<string[]> {
    return this.apiService.get<string[]>(`${this.endpoint}/categories`);
  }

  // Récupérer les livres avec stock faible
  getLowStockBooks(threshold = 10): Observable<Book[]> {
    const params = { threshold: threshold.toString() };
    return this.apiService.get<Book[]>(`${this.endpoint}/low-stock`, params);
  }

  // Mettre à jour le stock
  updateStock(id: number, stock: number): Observable<Book> {
    const params = { stock: stock.toString() };
    return this.apiService.put<Book>(`${this.endpoint}/${id}/stock`, params);
  }

  // Toggle le statut featured
  toggleFeatured(id: number): Observable<Book> {
    return this.apiService.put<Book>(`${this.endpoint}/${id}/toggle-featured`, {});
  }

  // Récupérer les livres par plage de prix
  getBooksByPriceRange(minPrice: number, maxPrice: number): Observable<Book[]> {
    const params = {
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString()
    };
    return this.apiService.get<Book[]>(`${this.endpoint}/price-range`, params);
  }

  // Vérifier la disponibilité d'un ISBN
  checkISBNAvailability(isbn: string, excludeId?: number): Observable<boolean> {
    const params: any = { isbn };
    if (excludeId) {
      params.excludeId = excludeId.toString();
    }
    return this.apiService.get<boolean>(`${this.endpoint}/check-isbn`, params);
  }
}