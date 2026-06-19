import { baseApi } from "@/services/api/baseApi";
import type { SubscriptionPlan } from "./types";

export const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentPlan: builder.query<SubscriptionPlan, void>({
      query: () => "/billing/current-plan",
      providesTags: ["Billing"]
    })
  })
});

export const { useGetCurrentPlanQuery } = billingApi;
