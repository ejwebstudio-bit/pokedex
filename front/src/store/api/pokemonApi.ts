import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_URL_V1  || "http://localhost:3000";


export interface Pokemon {
  id: number;
  name: string;
  origine: string;
  hp: number;
  atk: number;
  def: number;
  atk_spe: number;
  def_spe: number;
  speed: number;
  types: PokeType[];
}

export interface PokeType {
  id: number;
  name: string;
  color: string;
}


export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({
     baseUrl: API_URL, }),
  endpoints: (builder) => ({
    getAllPokemons: builder.query<Pokemon[], void>({
      query: () => '/pokemons',
    }),
    getPokemonById: builder.query<Pokemon, string>({
      query: (id: string) => `/pokemons/${id}`,
    }),
    getFilteredPokemons: builder.query<Pokemon[], { name?: string; typeId?: number }>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.name) params.append('name', filters.name);
        if (filters.typeId) params.append('typeId', String(filters.typeId));
        return `/pokemons?${params.toString()}`;
      },
    }),
  }),
});

export const { useGetAllPokemonsQuery, useGetPokemonByIdQuery, useGetFilteredPokemonsQuery } = pokemonApi;