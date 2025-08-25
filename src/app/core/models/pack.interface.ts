export interface Pack {
  id?: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  stockQuantity?: number;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}