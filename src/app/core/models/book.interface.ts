export interface Book {
  id?: number;
  isbn: string;
  title: string;
  author: string;
  description?: string;
  price: number;
  stockQuantity: number;
  category?: string;
  publisher?: string;
  publicationYear?: number;
  language?: string;
  pageCount?: number;
  imageUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
