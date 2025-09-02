import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

interface Pack {
  id?: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  stockQuantity?: number;
  category?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PackService {
  private readonly endpoint = 'packs';

  constructor(private apiService: ApiService) {}

  getAllPacks(): Observable<Pack[]> {
    return this.apiService.get<Pack[]>(this.endpoint);
  }

  getPackById(id: number): Observable<Pack> {
    return this.apiService.get<Pack>(`${this.endpoint}/${id}`);
  }

  createPack(pack: Pack): Observable<Pack> {
    return this.apiService.post<Pack>(this.endpoint, pack);
  }

  updatePack(id: number, pack: Pack): Observable<Pack> {
    return this.apiService.put<Pack>(`${this.endpoint}/${id}`, pack);
  }

  deletePack(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  toggleFeatured(id: number): Observable<Pack> {
    return this.apiService.put<Pack>(`${this.endpoint}/${id}/toggle-featured`, {});
  }

  getActivePacks(): Observable<Pack[]> {
    return this.apiService.get<Pack[]>(`${this.endpoint}/active`);
  }

  getFeaturedPacks(): Observable<Pack[]> {
    return this.apiService.get<Pack[]>(`${this.endpoint}/featured`);
  }
}