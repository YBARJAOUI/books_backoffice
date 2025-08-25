// src/app/features/books/book-list/book-list.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-book-list',
  template: `
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="custom-card">
            <div class="card-header">
              <h5><i class="pi pi-book me-2"></i>Gestion des Livres</h5>
            </div>
            <div class="card-body">
              <p>Module de gestion des livres en cours de développement...</p>
              <div class="d-flex gap-2">
                <button class="btn btn-primary">
                  <i class="pi pi-plus me-2"></i>Nouveau Livre
                </button>
                <button class="btn btn-outline-secondary">
                  <i class="pi pi-search me-2"></i>Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class BookListComponent { }