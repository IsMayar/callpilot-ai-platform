import { baseApi } from "@/services/api/baseApi";
import type {
  Customer,
  CustomerListParams,
  CustomerPage,
  CustomerRequest
} from "./types";

export const customersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<CustomerPage, CustomerListParams | void>({
      query: (params) => ({
        url: "/customers",
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
          search: params?.search || undefined
        }
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map((customer) => ({
                type: "Customer" as const,
                id: customer.id
              })),
              { type: "Customer" as const, id: "LIST" }
            ]
          : [{ type: "Customer" as const, id: "LIST" }]
    }),
    getCustomer: builder.query<Customer, string>({
      query: (id) => `/customers/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Customer", id }]
    }),
    createCustomer: builder.mutation<Customer, CustomerRequest>({
      query: (body) => ({
        url: "/customers",
        method: "POST",
        body
      }),
      invalidatesTags: [{ type: "Customer", id: "LIST" }]
    }),
    updateCustomer: builder.mutation<
      Customer,
      { id: string; body: CustomerRequest }
    >({
      query: ({ id, body }) => ({
        url: `/customers/${id}`,
        method: "PUT",
        body
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Customer", id },
        { type: "Customer", id: "LIST" }
      ]
    }),
    deleteCustomer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Customer", id },
        { type: "Customer", id: "LIST" }
      ]
    })
  })
});

export const {
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useGetCustomerQuery,
  useGetCustomersQuery,
  useUpdateCustomerMutation
} = customersApi;

