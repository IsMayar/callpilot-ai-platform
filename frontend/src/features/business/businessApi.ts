import { baseApi } from "@/services/api/baseApi";
import type { Business, UpsertBusinessRequest } from "./types";

export const businessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBusiness: builder.mutation<Business, UpsertBusinessRequest>({
      query: (body) => ({
        url: "/businesses",
        method: "POST",
        body
      }),
      invalidatesTags: ["Business"]
    }),
    getCurrentBusiness: builder.query<Business, void>({
      query: () => "/businesses/current",
      providesTags: ["Business"]
    }),
    updateBusiness: builder.mutation<
      Business,
      { id: string; body: UpsertBusinessRequest }
    >({
      query: ({ id, body }) => ({
        url: `/businesses/${id}`,
        method: "PUT",
        body
      }),
      invalidatesTags: ["Business"]
    })
  })
});

export const {
  useCreateBusinessMutation,
  useGetCurrentBusinessQuery,
  useUpdateBusinessMutation
} = businessApi;

