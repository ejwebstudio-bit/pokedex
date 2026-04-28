"use client";

import { useState } from "react";
import Card from "../components/Card";
import Modal from "../components/ui/modal";
import { useGetAllPokemonsQuery } from "@/store/api/pokemonApi";
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { Pokemon } from "@/store/api/pokemonApi";
import { TeamMemberCard } from "@/components/TeamMemberCard";
import { useFavorites } from "@/hooks/useFavorites";



export default function Home() {

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon>();
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const { data: pokemons, isLoading, isError, error} = useGetAllPokemonsQuery();
  const { isFavorite, toggleFavorite } = useFavorites();

  const filteredPokemons = favoritesOnly
    ? pokemons?.filter((p) => isFavorite(p.id))
    : pokemons;

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
          {/* Filter toggle */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setFavoritesOnly((prev) => !prev)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                favoritesOnly
                  ? 'bg-red-500 text-white border-red-500 shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600'
              }`}
            >
              {favoritesOnly ? '❤️ Favoris seulement' : '🤍 Tous les Pokémons'}
            </button>
          </div>
        </div>

        {/* Fully responsive grid with 4 columns max on desktop */}
        <div  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {filteredPokemons?.map((pokemon) => (
            <TeamMemberCard
              onClick={() => handleShowDetails(pokemon)}
              key={pokemon.id}
              pokemon={pokemon}
              isFavorite={isFavorite(pokemon.id)}
              onToggleFavorite={() => toggleFavorite(pokemon.id)}
            />
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

