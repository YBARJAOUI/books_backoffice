import { Component } from '@angular/core';

@Component({
  selector: 'app-book-detail',
  template: `
    <div class="container">
      <div class="custom-card">
        <div class="card-header">
          <h5><i class="pi pi-eye me-2"></i>Détails du Livre</h5>
        </div>
        <div class="card-body">
          <p>Détails du livre en cours de développement...</p>
        </div>
      </div>
    </div>
  `
})
export class BookDetailComponent { }