import { baseApi } from "@/services/api/baseApi";
import type {
  TeamListParams,
  TeamMember,
  TeamMemberPage,
  TeamMemberRequest
} from "./types";

export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeamMembers: builder.query<TeamMemberPage, TeamListParams | void>({
      query: (params) => ({
        url: "/team",
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10
        }
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map((teamMember) => ({
                type: "TeamMember" as const,
                id: teamMember.id
              })),
              { type: "TeamMember" as const, id: "LIST" }
            ]
          : [{ type: "TeamMember" as const, id: "LIST" }]
    }),
    createTeamMember: builder.mutation<TeamMember, TeamMemberRequest>({
      query: (body) => ({
        url: "/team",
        method: "POST",
        body
      }),
      invalidatesTags: [{ type: "TeamMember", id: "LIST" }]
    }),
    updateTeamMember: builder.mutation<
      TeamMember,
      { id: string; body: TeamMemberRequest }
    >({
      query: ({ id, body }) => ({
        url: `/team/${id}`,
        method: "PUT",
        body
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "TeamMember", id },
        { type: "TeamMember", id: "LIST" }
      ]
    }),
    deleteTeamMember: builder.mutation<void, string>({
      query: (id) => ({
        url: `/team/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "TeamMember", id },
        { type: "TeamMember", id: "LIST" }
      ]
    })
  })
});

export const {
  useCreateTeamMemberMutation,
  useDeleteTeamMemberMutation,
  useGetTeamMembersQuery,
  useUpdateTeamMemberMutation
} = teamApi;
