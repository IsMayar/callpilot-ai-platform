export type MessageDirection = "INBOUND" | "OUTBOUND";

export type MessageChannel = "SMS";

export type MessageStatus = "QUEUED" | "SENT" | "FAILED" | "RECEIVED";

export type Message = {
  id: string;
  businessId: string;
  customerId: string | null;
  leadId: string | null;
  direction: MessageDirection;
  channel: MessageChannel;
  body: string;
  status: MessageStatus;
  sentAt: string | null;
  createdAt: string;
};

export type MessageRequest = {
  customerId: string | null;
  leadId: string | null;
  direction: MessageDirection;
  channel: MessageChannel;
  body: string;
};

export type MessageListParams = {
  page?: number;
  size?: number;
  search?: string;
};

export type MessagePage = {
  content: Message[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};
