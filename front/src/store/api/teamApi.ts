import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Pokemon } from './pokemonApi';


const API_URL = import.meta.env.VITE_API_URL_V1  || "http://localhost:3000";

export interface Team {
  id: string;
  name: string;
  description: string;
  pokemons: Pokemon[];
}

export interface CreateTeamForm {
  name: string;
  description: string;
}


export const teamApi = createApi({
  reducerPath: 'teamApi',
  baseQuery: fetchBaseQuery({
     baseUrl: API_URL,
   }),
  tagTypes: ["Teams"],
  endpoints: (builder) => ({
    getAllTeams: builder.query<Team[], void>({
      query: () => '/teams',
      providesTags: [{ type: "Teams"}]
    }),
    getTeamById: builder.query<Team, string>({
      query: (id: string) => `/teams/${id}`,
      providesTags: [{ type: "Teams"}]
    }),
    createOneTeam: builder.mutation<{ success: boolean; message: string }, CreateTeamForm>({
      query: (team) => ({
        url: "/teams",
        method: "POST",
        body: team,
      }),
      invalidatesTags: [{ type: "Teams" }]
    }),
    updateTeam: builder.mutation<Team, { id: string; body: Team }>({
      query: ({ id, body }) => ({
        url: `/teams/${id}`,
        method: "PATCH",
        body
      }),
      invalidatesTags: [{ type: "Teams"}]
    }),
    deleteOneTeam: builder.mutation<void, string>({
      query: (teamId) => ({
        url: `/teams/${teamId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Teams" }]
    }),
    addPokemonToTeam: builder.mutation<Team, { idTeam: string; idPokemon: string }>({
      query: ({ idTeam, idPokemon }) => ({
        url: `/team/${idTeam}/pokemon/${idPokemon}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Teams" }]
    }),
    removePokemonToTeam: builder.mutation<Team, { idTeam: string; idPokemon: string }>({
      query: ({ idTeam, idPokemon }) => ({
        url: `/team/${idTeam}/pokemon/${idPokemon}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Teams" }]
    }),
  }),
});

export const { useGetAllTeamsQuery, useGetTeamByIdQuery, useCreateOneTeamMutation, useAddPokemonToTeamMutation, useRemovePokemonToTeamMutation, useDeleteOneTeamMutation, useUpdateTeamMutation } = teamApi;