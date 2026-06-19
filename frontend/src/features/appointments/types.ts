export type AppointmentStatus =
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type Appointment = {
  id: string;
  businessId: string;
  customerId: string | null;
  leadId: string | null;
  title: string;
  description: string | null;
  scheduledStart: string;
  scheduledEnd: string;
  status: AppointmentStatus;
  address: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AppointmentRequest = {
  customerId: string | null;
  leadId: string | null;
  title: string;
  description: string | null;
  scheduledStart: string;
  scheduledEnd: string;
  status: AppointmentStatus;
  address: string | null;
};

export type AppointmentListParams = {
  page?: number;
  size?: number;
  status?: AppointmentStatus;
};

export type AppointmentPage = {
  content: Appointment[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};
