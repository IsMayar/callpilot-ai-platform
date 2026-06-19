export type Customer = {
  id: string;
  businessId: string;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  address: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CustomerRequest = {
  fullName: string;
  phoneNumber: string;
  email: string | null;
  address: string | null;
  notes: string | null;
};

export type CustomerListParams = {
  page?: number;
  size?: number;
  search?: string;
};

export type CustomerPage = {
  content: Customer[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

