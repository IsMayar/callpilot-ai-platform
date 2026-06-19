export type SubscriptionPlanStatus =
  | "TRIAL"
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELLED";

export type SubscriptionPlan = {
  id: string;
  businessId: string;
  planName: string;
  status: SubscriptionPlanStatus;
  monthlyPrice: number;
  startedAt: string;
  renewsAt: string;
  createdAt: string;
  updatedAt: string;
};
