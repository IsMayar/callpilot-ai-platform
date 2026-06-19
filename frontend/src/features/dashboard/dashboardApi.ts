import { baseApi } from "@/services/api/baseApi";
import type { DashboardSummary } from "./types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<DashboardSummary, void>({
      query: () => "/dashboard/summary",
      providesTags: ["Dashboard"]
    })
  })
});

export const { useGetDashboardSummaryQuery } = dashboardApi;

