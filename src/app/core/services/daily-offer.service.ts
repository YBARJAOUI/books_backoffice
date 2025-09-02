
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

interface DailyOffer {
  id?: number;
  title: string;
  description: string;
  originalPrice: number;
  offerPrice: number;
  discountPercentage?: number;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  bookId?: number;
  packId?: number;
  limitQuantity?: number;
  soldQuantity?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DailyOfferService {
  private readonly endpoint = 'daily-offers';

  constructor(private apiService: ApiService) {}

  getAllOffers(): Observable<DailyOffer[]> {
    return this.apiService.get<DailyOffer[]>(this.endpoint);
  }

  getOfferById(id: number): Observable<DailyOffer> {
    return this.apiService.get<DailyOffer>(`${this.endpoint}/${id}`);
  }

  createOffer(offer: DailyOffer): Observable<DailyOffer> {
    return this.apiService.post<DailyOffer>(this.endpoint, offer);
  }

  updateOffer(id: number, offer: DailyOffer): Observable<DailyOffer> {
    return this.apiService.put<DailyOffer>(`${this.endpoint}/${id}`, offer);
  }

  deleteOffer(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  getActiveOffers(): Observable<DailyOffer[]> {
    return this.apiService.get<DailyOffer[]>(`${this.endpoint}/active`);
  }

  getCurrentOffers(): Observable<DailyOffer[]> {
    return this.apiService.get<DailyOffer[]>(`${this.endpoint}/current`);
  }

  recordSale(id: number, quantity: number): Observable<DailyOffer> {
    return this.apiService.put<DailyOffer>(`${this.endpoint}/${id}/record-sale?quantity=${quantity}`, {});
  }
}
