export type CallStatus =
  | "ANSWERED_BY_AI"
  | "MISSED"
  | "VOICEMAIL"
  | "ESCALATED"
  | "COMPLETED";

export type CallRecord = {
  id: string;
  businessId: string;
  customerId: string | null;
  leadId: string | null;
  callerPhone: string;
  callStatus: CallStatus;
  durationSeconds: number;
  transcript: string | null;
  aiSummary: string | null;
  intent: string | null;
  urgency: string | null;
  recordingUrl: string | null;
  createdAt: string;
};

export type CallRecordRequest = {
  customerId: string | null;
  leadId: string | null;
  callerPhone: string;
  callStatus: CallStatus;
  durationSeconds: number;
  transcript: string | null;
  aiSummary: string | null;
  intent: string | null;
  urgency: string | null;
  recordingUrl: string | null;
};

export type CallRecordListParams = {
  page?: number;
  size?: number;
  search?: string;
  status?: CallStatus;
};

export type CallRecordPage = {
  content: CallRecord[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};
