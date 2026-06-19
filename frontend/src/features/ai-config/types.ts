export type AiReceptionistConfig = {
  id: string;
  businessId: string;
  greetingMessage: string;
  afterHoursMessage: string;
  emergencyInstructions: string;
  bookingRules: string;
  servicesOffered: string;
  fallbackPhoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AiReceptionistConfigRequest = {
  greetingMessage: string;
  afterHoursMessage: string;
  emergencyInstructions: string;
  bookingRules: string;
  servicesOffered: string;
  fallbackPhoneNumber: string | null;
};
