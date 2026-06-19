import { baseApi } from "@/services/api/baseApi";
import type { Lead, LeadListParams, LeadPage, LeadRequest } from "./types";

export const leadsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeads: builder.query<LeadPage, LeadListParams | void>({
      query: (params) => ({
        url: "/leads",
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
          search: params?.search || undefined,
          status: params?.status || undefined
        }
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map((lead) => ({
                type: "Lead" as const,
                id: lead.id
              })),
              { type: "Lead" as const, id: "LIST" }
            ]
          : [{ type: "Lead" as const, id: "LIST" }]
    }),
    getLead: builder.query<Lead, string>({
      query: (id) => `/leads/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Lead", id }]
    }),
    createLead: builder.mutation<Lead, LeadRequest>({
      query: (body) => ({
        url: "/leads",
        method: "POST",
        body
      }),
      invalidatesTags: [{ type: "Lead", id: "LIST" }, "Dashboard"]
    }),
    updateLead: builder.mutation<Lead, { id: string; body: LeadRequest }>({
      query: ({ id, body }) => ({
        url: `/leads/${id}`,
        method: "PUT",
        body
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Lead", id },
        { type: "Lead", id: "LIST" },
        "Dashboard"
      ]
    }),
    deleteLead: builder.mutation<void, string>({
      query: (id) => ({
        url: `/leads/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Lead", id },
        { type: "Lead", id: "LIST" },
        "Dashboard"
      ]
    })
  })
});

export const {
  useCreateLeadMutation,
  useDeleteLeadMutation,
  useGetLeadQuery,
  useGetLeadsQuery,
  useUpdateLeadMutation
} = leadsApi;

