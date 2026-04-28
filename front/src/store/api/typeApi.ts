import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { PokeType } from './pokemonApi';

const API_URL = import.meta.env.VITE_API_URL_V1 || "http://localhost:3000";

export const typeApi = createApi({
  reducerPath: 'typeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  endpoints: (builder) => ({
    getAllTypes: builder.query<PokeType[], void>({
      query: () => '/types',
    }),
  }),
});

export const { useGetAllTypesQuery } = typeApi;
