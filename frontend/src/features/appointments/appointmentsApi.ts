import { baseApi } from "@/services/api/baseApi";
import type {
  Appointment,
  AppointmentListParams,
  AppointmentPage,
  AppointmentRequest
} from "./types";

export const appointmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppointments: builder.query<AppointmentPage, AppointmentListParams | void>({
      query: (params) => ({
        url: "/appointments",
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
          status: params?.status || undefined
        }
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map((appointment) => ({
                type: "Appointment" as const,
                id: appointment.id
              })),
              { type: "Appointment" as const, id: "LIST" }
            ]
          : [{ type: "Appointment" as const, id: "LIST" }]
    }),
    getAppointment: builder.query<Appointment, string>({
      query: (id) => `/appointments/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Appointment", id }]
    }),
    createAppointment: builder.mutation<Appointment, AppointmentRequest>({
      query: (body) => ({
        url: "/appointments",
        method: "POST",
        body
      }),
      invalidatesTags: [
        { type: "Appointment", id: "LIST" },
        "Dashboard"
      ]
    }),
    updateAppointment: builder.mutation<
      Appointment,
      { id: string; body: AppointmentRequest }
    >({
      query: ({ id, body }) => ({
        url: `/appointments/${id}`,
        method: "PUT",
        body
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Appointment", id },
        { type: "Appointment", id: "LIST" },
        "Dashboard"
      ]
    }),
    deleteAppointment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/appointments/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Appointment", id },
        { type: "Appointment", id: "LIST" },
        "Dashboard"
      ]
    })
  })
});

export const {
  useCreateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAppointmentQuery,
  useGetAppointmentsQuery,
  useUpdateAppointmentMutation
} = appointmentsApi;
