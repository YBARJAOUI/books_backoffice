import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import { PackService } from '../../../core/services/pack.service';

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
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-pack-list',
  templateUrl: './pack-list.component.html',
  styleUrls: ['./pack-list.component.scss']
})
export class PackListComponent implements OnInit {
  packs: Pack[] = [];
  loading = false;
  showDialog = false;
  isEditMode = false;
  
  currentPack: Pack = {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    stockQuantity: 0,
    category: '',
    isActive: true,
    isFeatured: false
  };

  categories = ['Fiction', 'Non-Fiction', 'Science-Fiction', 'Fantasy', 'Romance', 'Thriller', 'Business'];

  constructor(
    private packService: PackService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadPacks();
  }

  loadPacks() {
    this.loading = true;
    this.packService.getAllPacks().subscribe({
      next: (packs) => {
        this.packs = packs;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading packs:', error);
        this.notificationService.error('Error loading packs');
        this.loading = false;
      }
    });
  }

  showNewPackDialog() {
    this.currentPack = {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      stockQuantity: 0,
      category: '',
      isActive: true,
      isFeatured: false
    };
    this.isEditMode = false;
    this.showDialog = true;
  }

  editPack(pack: Pack) {
    this.currentPack = { ...pack };
    this.isEditMode = true;
    this.showDialog = true;
  }

  savePack() {
    if (!this.currentPack.name || this.currentPack.price <= 0) {
      this.notificationService.error('Please fill in all required fields');
      return;
    }

    if (this.isEditMode) {
      this.packService.updatePack(this.currentPack.id!, this.currentPack).subscribe({
        next: () => {
          this.notificationService.success('Pack updated successfully');
          this.showDialog = false;
          this.loadPacks();
        },
        error: (error) => {
          console.error('Error updating pack:', error);
          this.notificationService.error('Error updating pack');
        }
      });
    } else {
      this.packService.createPack(this.currentPack).subscribe({
        next: () => {
          this.notificationService.success('Pack created successfully');
          this.showDialog = false;
          this.loadPacks();
        },
        error: (error) => {
          console.error('Error creating pack:', error);
          this.notificationService.error('Error creating pack');
        }
      });
    }
  }

  deletePack(pack: Pack) {
    if (confirm(`Are you sure you want to delete "${pack.name}"?`)) {
      this.packService.deletePack(pack.id!).subscribe({
        next: () => {
          this.notificationService.success('Pack deleted successfully');
          this.loadPacks();
        },
        error: (error) => {
          console.error('Error deleting pack:', error);
          this.notificationService.error('Error deleting pack');
        }
      });
    }
  }

  toggleFeatured(pack: Pack) {
    this.packService.toggleFeatured(pack.id!).subscribe({
      next: () => {
        this.notificationService.success('Pack featured status updated');
        this.loadPacks();
      },
      error: (error) => {
        console.error('Error updating featured status:', error);
        this.notificationService.error('Error updating featured status');
      }
    });
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'danger';
    if (stock <= 10) return 'warning';
    return 'success';
  }
}
