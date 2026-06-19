export type LeadStatus = "NEW" | "CONTACTED" | "BOOKED" | "CLOSED" | "LOST";

export type Lead = {
  id: string;
  businessId: string;
  customerName: string;
  phoneNumber: string;
  email: string | null;
  serviceNeeded: string;
  urgency: string;
  status: LeadStatus;
  estimatedValue: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LeadRequest = {
  customerName: string;
  phoneNumber: string;
  email: string | null;
  serviceNeeded: string;
  urgency: string;
  status: LeadStatus;
  estimatedValue: number;
  notes: string | null;
};

export type LeadListParams = {
  page?: number;
  size?: number;
  search?: string;
  status?: LeadStatus;
};

export type LeadPage = {
  content: Lead[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

