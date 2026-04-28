"use client";

import { useState } from "react";
import Card from "../components/Card";
import Modal from "../components/ui/modal";

import { useGetAllPokemonsQuery, useGetFilteredPokemonsQuery } from "@/store/api/pokemonApi";
import { useGetAllTypesQuery } from "@/store/api/typeApi";
import { useGetAllTeamsQuery, useAddPokemonToTeamMutation } from "@/store/api/teamApi";
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { Pokemon } from "@/store/api/pokemonApi";
import type { Team } from "@/store/api/teamApi";
import { TeamMemberCard } from "@/components/TeamMemberCard";
import { useFavorites } from "@/hooks/useFavorites";



export default function Home() {

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTeamSelector, setShowTeamSelector] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon>();
  const [favoritesOnly, setFavoritesOnly] = useState(false);

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
  const { isFavorite, toggleFavorite } = useFavorites();

  const displayedPokemons = favoritesOnly
    ? pokemons?.filter((p) => isFavorite(p.id))
    : pokemons;
  const [addToast, setAddToast] = useState<string | null>(null);
  const { data: teams } = useGetAllTeamsQuery();
  const [addPokemonToTeam, { isLoading: isAdding }] = useAddPokemonToTeamMutation();


  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur : {(error as FetchBaseQueryError).status}</p>;
 
  function handleShowDetails (pokemon: Pokemon) {
    setSelectedPokemon(pokemon);
    setShowDetailsModal(true);
  }

  async function handleAddToTeam(teamId: string) {
    if (!selectedPokemon) return;
    try {
      await addPokemonToTeam({ idTeam: teamId, idPokemon: String(selectedPokemon.id) }).unwrap();
      setAddToast(`✅ ${selectedPokemon.name} ajouté à l'équipe !`);
      setShowTeamSelector(false);
      setTimeout(() => setAddToast(null), 3000);
    } catch (err) {
      setAddToast("❌ Erreur : l'équipe a peut-être déjà 5 Pokémon");
      setTimeout(() => setAddToast(null), 3000);
    }
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
          {displayedPokemons?.map((pokemon) => (
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
    
    {/* Toast notification */}
    {addToast && (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl shadow-2xl text-sm font-medium animate-bounce">
        {addToast}
      </div>
    )}

    <Modal
      isOpen={showDetailsModal}
      onClose={() => setShowDetailsModal(false)}
      title='Détails'
    >
      {selectedPokemon ? (
        <>
          <Card pokemon={selectedPokemon}/>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => { setShowDetailsModal(false); setShowTeamSelector(true); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-600/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter à une équipe
            </button>
          </div>
        </>
      ) : (
        <div>Aucun Pokémon sélectionné</div>
      )}
    </Modal>

    {/* Team Selector Modal */}
    <Modal
      isOpen={showTeamSelector}
      onClose={() => setShowTeamSelector(false)}
      title="Choisir une équipe"
    >
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {teams && teams.length > 0 ? (
          teams.map((team: Team) => (
            <button
              key={team.id}
              onClick={() => handleAddToTeam(team.id)}
              disabled={isAdding}
              className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <p className="font-medium text-gray-900 dark:text-white">{team.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {team.pokemons?.length || 0}/5 Pokémon
              </p>
            </button>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            Aucune équipe disponible. Crée-en une depuis la page Équipes !
          </p>
        )}
      </div>
    </Modal>
    </div>
  );
};

