import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_URL_V1 || "http://localhost:3000";

export interface Member {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export const memberApi = createApi({
  reducerPath: 'memberApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  endpoints: (builder) => ({
    getAllMembers: builder.query<Member[], void>({
      query: () => '/members',
    }),
  }),
});

export const { useGetAllMembersQuery } = memberApi;
