"use client";

import { useState } from "react";
import Card from "../components/Card";
import Modal from "../components/ui/modal";
import { useGetAllPokemonsQuery, useGetFilteredPokemonsQuery } from "@/store/api/pokemonApi";
import { useGetAllTypesQuery } from "@/store/api/typeApi";
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { Pokemon } from "@/store/api/pokemonApi";
import { TeamMemberCard } from "@/components/TeamMemberCard";



export default function Home() {

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon>();

  const [searchName, setSearchName] = useState("");
  const [selectedTypeId, setSelectedTypeId] = useState<number | undefined>(undefined);

  const hasFilters = searchName !== "" || selectedTypeId !== undefined;

  const { data: allPokemons, isLoading: allLoading, isError: allError, error: allErrorData } = useGetAllPokemonsQuery(undefined, { skip: hasFilters });
  const { data: filteredPokemons, isLoading: filteredLoading, isError: filteredError, error: filteredErrorData } = useGetFilteredPokemonsQuery(
    { name: searchName || undefined, typeId: selectedTypeId },
    { skip: !hasFilters }
  );
  const { data: types } = useGetAllTypesQuery();

  const isLoading = hasFilters ? filteredLoading : allLoading;
  const isError = hasFilters ? filteredError : allError;
  const error = hasFilters ? filteredErrorData : allErrorData;
  const pokemons = hasFilters ? filteredPokemons : allPokemons;

  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur : {(error as FetchBaseQueryError).status}</p>;
 
  function handleShowDetails (pokemon: Pokemon) {
    setSelectedPokemon(pokemon);
    setShowDetailsModal(true);
  }

  console.log('Pokemon DATA :', pokemons)

  return (
    <div className="relative mt-12 p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Google Font Import */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');`}
      </style>
      
      <div className="relative z-10 w-full max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 lg:mb-12 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 font-space-grotesk">
            POKEDEX
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
            Choisis tes Pokémons favoris et créér ton équipe de reve pour devenir le meilleur dresseur !
          </p>
        </div>

        {/* Search & Filters Section */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <input
            type="text"
            placeholder="Rechercher un Pokémon..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedTypeId ?? ""}
            onChange={(e) => setSelectedTypeId(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full sm:w-48 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les types</option>
            {types?.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        {/* Fully responsive grid with 4 columns max on desktop */}
        <div  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {pokemons?.map((pokemon) => (
            <TeamMemberCard onClick={() => handleShowDetails(pokemon)} key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      </div>
      {/* Add keyframes for animation and font-family */}
      <style>{`
        @keyframes aurora {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-aurora {
          animation: aurora 20s linear infinite;
        }
        .font-space-grotesk {
          font-family: 'Space Grotesk', sans-serif;
        }
      `}</style>
    <Modal
      isOpen={showDetailsModal}
      onClose={() => setShowDetailsModal(false)}
      title='Détails'
    >
      {selectedPokemon ? (
          <Card pokemon={selectedPokemon}/>
        ) : (
          <div>Aucun Pokémon sélectionné</div>
        )}
    </Modal>
    </div>
  );
};

