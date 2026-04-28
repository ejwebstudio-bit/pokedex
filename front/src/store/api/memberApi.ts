import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_URL_V1 || "http://localhost:3000";

export interface Member {
  id: string;
  name: string;
  role?: string;
  team_id: number;
  team?: { id: string; name: string };
  email?: string;
  createdAt?: string;
}

export interface CreateMemberForm {
  name: string;
  role?: string;
  team_id: number;
}

export interface UpdateMemberForm {
  name?: string;
  role?: string;
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
    getMembersByTeam: builder.query<Member[], string>({
      query: (teamId) => `/teams/${teamId}/members`,
      providesTags: [{ type: "Members" }],
    }),
    getOneMember: builder.query<Member, string>({
      query: (id) => `/members/${id}`,
      providesTags: [{ type: "Members" }],
    }),
    createMember: builder.mutation<Member, CreateMemberForm>({
      query: (body) => ({
        url: '/members',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: "Members" }],
    }),
    updateMember: builder.mutation<Member, { id: string } & UpdateMemberForm>({
      query: ({ id, ...body }) => ({
        url: `/members/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: "Members" }],
    }),
    deleteMember: builder.mutation<void, string>({
      query: (id) => ({
        url: `/members/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: "Members" }],
    }),
  }),
});

export const {
  useGetAllMembersQuery,
  useGetMembersByTeamQuery,
  useGetOneMemberQuery,
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
} = memberApi;
