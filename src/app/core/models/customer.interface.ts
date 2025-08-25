export interface Customer {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city?: string;
  postalCode?: string;
  country?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
