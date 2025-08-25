export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

// Interface qui correspond exactement à Spring Data Page
export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}