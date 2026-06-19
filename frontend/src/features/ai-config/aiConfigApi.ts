import { baseApi } from "@/services/api/baseApi";
import type {
  AiReceptionistConfig,
  AiReceptionistConfigRequest
} from "./types";

export const aiConfigApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiConfig: builder.query<AiReceptionistConfig, void>({
      query: () => "/ai-config",
      providesTags: ["AiConfig"]
    }),
    updateAiConfig: builder.mutation<
      AiReceptionistConfig,
      AiReceptionistConfigRequest
    >({
      query: (body) => ({
        url: "/ai-config",
        method: "PUT",
        body
      }),
      invalidatesTags: ["AiConfig"]
    })
  })
});

export const {
  useGetAiConfigQuery,
  useUpdateAiConfigMutation
} = aiConfigApi;
