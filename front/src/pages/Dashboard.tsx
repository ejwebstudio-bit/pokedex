"use client";

import { useState, useEffect } from "react";
import { useGetAllPokemonsQuery } from "@/store/api/pokemonApi";
import { useGetAllTeamsQuery } from "@/store/api/teamApi";
import type { Pokemon } from "@/store/api/pokemonApi";
import type { Team } from "@/store/api/teamApi";

interface PokemonStat {
  name: string;
  totalStats: number;
  hp: number;
  atk: number;
  def: number;
  atk_spe: number;
  def_spe: number;
  speed: number;
  id: number;
}

function getTotalStats(p: Pokemon): number {
  return p.hp + p.atk + p.def + p.atk_spe + p.def_spe + p.speed;
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color?: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-black/20">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color || "bg-blue-50 dark:bg-blue-900/20"}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function TopPokemonCard({ pokemon, rank }: { pokemon: PokemonStat; rank: number }) {
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
      <span className="text-2xl">{medals[rank - 1] || `#${rank}`}</span>
      <img
        src={`./img/${pokemon.id}.webp`}
        alt={pokemon.name}
        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = `https://placehold.co/48x48/E2E8F0/4A5568?text=${pokemon.name[0]}`;
        }}
      />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 dark:text-white truncate">{pokemon.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {pokemon.hp}HP | {pokemon.atk}ATK | {pokemon.def}DEF
        </p>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{pokemon.totalStats}</p>
        <p className="text-xs text-gray-400">stats</p>
      </div>
    </div>
  );
}

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium text-gray-900 dark:text-white">{value}</span>
      </div>
      <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: pokemons, isLoading: pokemonLoading } = useGetAllPokemonsQuery();
  const { data: teams, isLoading: teamsLoading } = useGetAllTeamsQuery();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (pokemonLoading || teamsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">Chargement du tableau de bord...</p>
      </div>
    );
  }

  // Calcul des stats
  const totalPokemons = pokemons?.length || 0;
  const totalTeams = teams?.length || 0;
  const totalPokemonsInTeams = teams?.reduce((acc, t) => acc + (t.pokemons?.length || 0), 0) || 0;

  // Top 3 Pokémon par stats totales
  const topPokemons: PokemonStat[] = (pokemons || [])
    .map((p) => ({
      ...p,
      totalStats: getTotalStats(p),
    }))
    .sort((a, b) => b.totalStats - a.totalStats)
    .slice(0, 3);

  // Stats totales du Top 1
  const top = topPokemons[0];
  const maxStat = top ? Math.max(top.hp, top.atk, top.def, top.atk_spe, top.def_spe, top.speed) : 200;

  // Pokémon le plus rapide et plus fort en attaque
  const fastest = pokemons?.reduce((a, b) => (a.speed > b.speed ? a : b));
  const strongest = pokemons?.reduce((a, b) => (a.atk > b.atk ? a : b));

  return (
    <div className="relative mt-16 p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-space-grotesk mb-2">
          Tableau de Bord
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Vue d'ensemble de ton Pokédex
        </p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className={`transition-all duration-500 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <StatCard label="Pokémons" value={totalPokemons} icon="🔢" color="bg-blue-50 dark:bg-blue-900/20" />
        </div>
        <div className={`transition-all duration-500 delay-100 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <StatCard label="Équipes" value={totalTeams} icon="👥" color="bg-green-50 dark:bg-green-900/20" />
        </div>
        <div className={`transition-all duration-500 delay-200 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <StatCard label="Dans les équipes" value={totalPokemonsInTeams} icon="⚡" color="bg-purple-50 dark:bg-purple-900/20" />
        </div>
        <div className={`transition-all duration-500 delay-300 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <StatCard label="Moy. par équipe" value={totalTeams > 0 ? (totalPokemonsInTeams / totalTeams).toFixed(1) : 0} icon="📊" color="bg-orange-50 dark:bg-orange-900/20" />
        </div>
      </div>

      {/* Statistiques vedettes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top 3 Pokémon */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-black/20">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🏆 Top 3 Pokémon</h2>
          <div className="space-y-3">
            {topPokemons.map((pokemon, i) => (
              <div key={pokemon.id} className={`transition-all duration-500 ${animate ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`} style={{ transitionDelay: `${400 + i * 100}ms` }}>
                <TopPokemonCard pokemon={pokemon} rank={i + 1} />
              </div>
            ))}
          </div>
        </div>

        {/* Stats du Top 1 */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-black/20">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            📊 Stats — <span className="text-blue-600 dark:text-blue-400">{top?.name || "—"}</span>
          </h2>
          {top && (
            <div className="space-y-4">
              <StatBar label="PV" value={top.hp} max={maxStat} color="bg-green-500" />
              <StatBar label="Attaque" value={top.atk} max={maxStat} color="bg-red-500" />
              <StatBar label="Défense" value={top.def} max={maxStat} color="bg-blue-500" />
              <StatBar label="Attaque Spé." value={top.atk_spe} max={maxStat} color="bg-purple-500" />
              <StatBar label="Défense Spé." value={top.def_spe} max={maxStat} color="bg-indigo-500" />
              <StatBar label="Vitesse" value={top.speed} max={maxStat} color="bg-yellow-500" />
            </div>
          )}
        </div>
      </div>

      {/* Fun facts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">⚡ Pokémon le plus rapide</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {fastest?.name || "—"} ({fastest?.speed} speed)
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 rounded-xl p-5 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">💥 Attaque la plus puissante</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {strongest?.name || "—"} ({strongest?.atk} ATK)
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
