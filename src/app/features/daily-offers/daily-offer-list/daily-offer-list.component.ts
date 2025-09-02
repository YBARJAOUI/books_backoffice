
import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../core/services/book.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DailyOfferService } from '../../../core/services/daily-offer.service';
import { PackService } from '../../../core/services/pack.service';

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

@Component({
  selector: 'app-daily-offer-list',
  templateUrl: './daily-offer-list.component.html',
  styleUrls: ['./daily-offer-list.component.scss']
})
export class DailyOfferListComponent implements OnInit {
  offers: DailyOffer[] = [];
  books: any[] = [];
  packs: any[] = [];
  loading = false;
  showDialog = false;
  isEditMode = false;
  
  currentOffer: DailyOffer = {
    title: '',
    description: '',
    originalPrice: 0,
    offerPrice: 0,
    imageUrl: '',
    startDate: '',
    endDate: '',
    isActive: true,
    limitQuantity: undefined
  };

  offerType: 'book' | 'pack' | 'custom' = 'custom';

  constructor(
    private dailyOfferService: DailyOfferService,
    private bookService: BookService,
    private packService: PackService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadOffers();
    this.loadBooks();
    this.loadPacks();
  }

  loadOffers() {
    this.loading = true;
    this.dailyOfferService.getAllOffers().subscribe({
      next: (offers) => {
        this.offers = offers;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading offers:', error);
        this.notificationService.error('Error loading offers');
        this.loading = false;
      }
    });
  }

  loadBooks() {
    this.bookService.getActiveBooks().subscribe({
      next: (books) => {
        this.books = books;
      },
      error: (error) => {
        console.error('Error loading books:', error);
      }
    });
  }

  loadPacks() {
    this.packService.getAllPacks().subscribe({
      next: (packs) => {
        this.packs = packs;
      },
      error: (error) => {
        console.error('Error loading packs:', error);
      }
    });
  }

  showNewOfferDialog() {
    this.currentOffer = {
      title: '',
      description: '',
      originalPrice: 0,
      offerPrice: 0,
      imageUrl: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      limitQuantity: undefined
    };
    this.offerType = 'custom';
    this.isEditMode = false;
    this.showDialog = true;
  }

  editOffer(offer: DailyOffer) {
    this.currentOffer = { ...offer };
    if (offer.bookId) this.offerType = 'book';
    else if (offer.packId) this.offerType = 'pack';
    else this.offerType = 'custom';
    this.isEditMode = true;
    this.showDialog = true;
  }

  saveOffer() {
    if (!this.currentOffer.title || !this.currentOffer.description) {
      this.notificationService.error('Please fill in all required fields');
      return;
    }

    // Calculate discount percentage
    if (this.currentOffer.originalPrice && this.currentOffer.offerPrice) {
      const discount = ((this.currentOffer.originalPrice - this.currentOffer.offerPrice) / this.currentOffer.originalPrice) * 100;
      this.currentOffer.discountPercentage = Math.round(discount);
    }

    if (this.isEditMode) {
      this.dailyOfferService.updateOffer(this.currentOffer.id!, this.currentOffer).subscribe({
        next: () => {
          this.notificationService.success('Offer updated successfully');
          this.showDialog = false;
          this.loadOffers();
        },
        error: (error) => {
          console.error('Error updating offer:', error);
          this.notificationService.error('Error updating offer');
        }
      });
    } else {
      this.dailyOfferService.createOffer(this.currentOffer).subscribe({
        next: () => {
          this.notificationService.success('Offer created successfully');
          this.showDialog = false;
          this.loadOffers();
        },
        error: (error) => {
          console.error('Error creating offer:', error);
          this.notificationService.error('Error creating offer');
        }
      });
    }
  }

  deleteOffer(offer: DailyOffer) {
    if (confirm(`Are you sure you want to delete "${offer.title}"?`)) {
      this.dailyOfferService.deleteOffer(offer.id!).subscribe({
        next: () => {
          this.notificationService.success('Offer deleted successfully');
          this.loadOffers();
        },
        error: (error) => {
          console.error('Error deleting offer:', error);
          this.notificationService.error('Error deleting offer');
        }
      });
    }
  }

  isOfferValid(offer: DailyOffer): boolean {
    const now = new Date();
    const start = new Date(offer.startDate);
    const end = new Date(offer.endDate);
    return offer.isActive! && now >= start && now <= end;
  }

  onOfferTypeChange() {
    if (this.offerType === 'book' && this.books.length > 0) {
      const book = this.books[0];
      this.currentOffer.bookId = book.id;
      this.currentOffer.originalPrice = book.price;
      this.currentOffer.title = `Special Offer: ${book.title}`;
    } else if (this.offerType === 'pack' && this.packs.length > 0) {
      const pack = this.packs[0];
      this.currentOffer.packId = pack.id;
      this.currentOffer.originalPrice = pack.price;
      this.currentOffer.title = `Pack Deal: ${pack.name}`;
    }
  }

  calculateDiscountPercentage(): number {
    if (this.currentOffer.originalPrice && this.currentOffer.offerPrice) {
      return Math.round(((this.currentOffer.originalPrice - this.currentOffer.offerPrice) / this.currentOffer.originalPrice) * 100);
    }
    return 0;
  }
}