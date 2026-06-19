import { baseApi } from "@/services/api/baseApi";
import type {
  CallRecord,
  CallRecordListParams,
  CallRecordPage,
  CallRecordRequest
} from "./types";

export const callsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCallRecords: builder.query<CallRecordPage, CallRecordListParams | void>({
      query: (params) => ({
        url: "/calls",
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
              ...result.content.map((callRecord) => ({
                type: "CallRecord" as const,
                id: callRecord.id
              })),
              { type: "CallRecord" as const, id: "LIST" }
            ]
          : [{ type: "CallRecord" as const, id: "LIST" }]
    }),
    getCallRecord: builder.query<CallRecord, string>({
      query: (id) => `/calls/${id}`,
      providesTags: (_result, _error, id) => [{ type: "CallRecord", id }]
    }),
    createCallRecord: builder.mutation<CallRecord, CallRecordRequest>({
      query: (body) => ({
        url: "/calls",
        method: "POST",
        body
      }),
      invalidatesTags: [
        { type: "CallRecord", id: "LIST" },
        "Dashboard"
      ]
    })
  })
});

export const {
  useCreateCallRecordMutation,
  useGetCallRecordQuery,
  useGetCallRecordsQuery
} = callsApi;
