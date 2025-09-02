export interface Book {
  id?: number;
  isbn: string;
  title: string;
  author: string;
  description?: string;
  price: number;
  imageBase64?: string;
  isAvailable?: boolean;
  language: 'francais' | 'arabe' | 'anglais';
  category: string;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}