import { baseApi } from "@/services/api/baseApi";
import type {
  Message,
  MessageListParams,
  MessagePage,
  MessageRequest
} from "./types";

export const messagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<MessagePage, MessageListParams | void>({
      query: (params) => ({
        url: "/messages",
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 20,
          search: params?.search || undefined
        }
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map((message) => ({
                type: "Message" as const,
                id: message.id
              })),
              { type: "Message" as const, id: "LIST" }
            ]
          : [{ type: "Message" as const, id: "LIST" }]
    }),
    createMessage: builder.mutation<Message, MessageRequest>({
      query: (body) => ({
        url: "/messages",
        method: "POST",
        body
      }),
      invalidatesTags: [{ type: "Message", id: "LIST" }]
    })
  })
});

export const {
  useCreateMessageMutation,
  useGetMessagesQuery
} = messagesApi;
