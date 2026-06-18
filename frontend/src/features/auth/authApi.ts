import { baseApi } from "@/services/api/baseApi";
import type { AuthSession, LoginRequest } from "./types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthSession, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body
      })
    }),
    currentUser: builder.query<AuthSession["user"], void>({
      query: () => "/auth/me"
    })
  })
});

export const { useCurrentUserQuery, useLoginMutation } = authApi;

