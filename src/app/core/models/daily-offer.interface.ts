import { Book } from "./book";
import { Pack } from "./pack.interface";

export interface DailyOffer {
  id?: number;
  title: string;
  description: string;
  originalPrice: number;
  offerPrice: number;
  discountPercentage?: number;
  imageUrl?: string;
  startDate: Date;
  endDate: Date;
  isActive?: boolean;
  book?: Book;
  pack?: Pack;
  limitQuantity?: number;
  soldQuantity?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
