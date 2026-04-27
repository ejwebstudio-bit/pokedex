import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_URL_V1 || "http://localhost:3000";

export interface Member {
  id: number;
  name: string;
  role: string | null;
  team_id: number;
  team?: {
    id: number;
    name: string;
  };
}

export interface CreateMemberForm {
  name: string;
  role?: string;
  team_id: number;
}

export const memberApi = createApi({
  reducerPath: 'memberApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  tagTypes: ["Members"],
  endpoints: (builder) => ({
    getAllMembers: builder.query<Member[], void>({
      query: () => '/members',
      providesTags: [{ type: "Members" }],
    }),
    getOneMember: builder.query<Member, string>({
      query: (id: string) => `/members/${id}`,
      providesTags: [{ type: "Members" }],
    }),
    getMembersByTeam: builder.query<Member[], string>({
      query: (teamId: string) => `/teams/${teamId}/members`,
      providesTags: [{ type: "Members" }],
    }),
    createMember: builder.mutation<Member, CreateMemberForm>({
      query: (member) => ({
        url: "/members",
        method: "POST",
        body: member,
      }),
      invalidatesTags: [{ type: "Members" }],
    }),
    updateMember: builder.mutation<Member, { id: string; name?: string; role?: string }>({
      query: ({ id, ...body }) => ({
        url: `/members/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Members" }],
    }),
    deleteMember: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/members/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Members" }],
    }),
  }),
});

export const {
  useGetAllMembersQuery,
  useGetOneMemberQuery,
  useGetMembersByTeamQuery,
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
} = memberApi;
