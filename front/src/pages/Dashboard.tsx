"use client";

import { useGetAllPokemonsQuery } from "@/store/api/pokemonApi";
import { useGetAllTeamsQuery } from "@/store/api/teamApi";
import { useGetAllMembersQuery } from "@/store/api/memberApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { Pokemon } from "@/store/api/pokemonApi";

// ─── Helpers ────────────────────────────────────────────────────────────────────

function computeTotalStats(p: Pokemon): number {
  return p.hp + p.atk + p.def + p.atk_spe + p.def_spe + p.speed;
}

function typeFrequency(pokemons: Pokemon[]): { name: string; count: number; color: string }[] {
  const map = new Map<string, { count: number; color: string }>();
  for (const p of pokemons) {
    for (const t of p.types) {
      const entry = map.get(t.name) ?? { count: 0, color: t.color };
      entry.count += 1;
      map.set(t.name, entry);
    }
  }
  return Array.from(map.entries())
    .map(([name, { count, color }]) => ({ name, count, color }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

// ─── Stat Card ───────────────────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div
      className="rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/60 dark:bg-black/60 backdrop-blur-lg p-5 shadow-lg dark:shadow-gray-900/20 flex flex-col items-start gap-1"
    >
      <span className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-medium">
        {label}
      </span>
      <span className={`text-3xl font-bold ${color}`}>
        {value}
      </span>
    </div>
  );
}

// ─── Simple Bar Chart ────────────────────────────────────────────────────────────

function BarChart({ pokemons }: { pokemons: Pokemon[] }) {
  const top = [...pokemons]
    .map((p) => ({ ...p, total: computeTotalStats(p) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
  const maxTotal = top[0]?.total ?? 1;

  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/60 dark:bg-black/60 backdrop-blur-lg p-5 shadow-lg dark:shadow-gray-900/20">
      <h3 className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 font-medium mb-4">
        Top 5 Pokémon – Statistiques totales
      </h3>
      <div className="flex items-end justify-between gap-3 h-48">
        {top.map((p) => {
          const pct = (p.total / maxTotal) * 100;
          return (
            <div key={p.id} className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-200 text-center leading-tight">
                {p.total}
              </span>
              <div
                className="w-full rounded-t-lg transition-all duration-500"
                style={{
                  height: `${Math.max(pct, 4)}%`,
                  background: `linear-gradient(180deg, #3b82f6 0%, #6366f1 100%)`,
                }}
              />
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 text-center truncate w-full">
                {p.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Timeline ────────────────────────────────────────────────────────────────────

function TeamTimeline({ teams }: { teams: { name: string; createdAt?: string }[] }) {
  const sorted = [...teams]
    .filter((t) => t.createdAt)
    .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime())
    .slice(-6);

  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/60 dark:bg-black/60 backdrop-blur-lg p-5 shadow-lg dark:shadow-gray-900/20">
      <h3 className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 font-medium mb-4">
        Timeline des équipes
      </h3>
      {sorted.length === 0 ? (
        <p className="text-gray-400 text-sm">Aucune équipe créée pour le moment.</p>
      ) : (
        <div className="relative pl-6 border-l-2 border-blue-400/40 dark:border-blue-500/40 space-y-4">
          {sorted.map((team, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-black/60" />
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{team.name}</p>
              <p className="text-xs text-gray-400">
                {team.createdAt
                  ? new Date(team.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────────

export default function Dashboard() {
  const {
    data: pokemons,
    isLoading: pokemonsLoading,
    isError: pokemonsError,
    error: pokemonsErr,
  } = useGetAllPokemonsQuery();

  const {
    data: teams,
    isLoading: teamsLoading,
    isError: teamsError,
    error: teamsErr,
  } = useGetAllTeamsQuery();

  const {
    data: members,
    isLoading: membersLoading,
    isError: membersError,
    error: membersErr,
  } = useGetAllMembersQuery();

  const loading = pokemonsLoading || teamsLoading || membersLoading;
  const error = pokemonsError || teamsError || membersError;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400 animate-pulse text-lg font-medium">
          Chargement du tableau de bord…
        </p>
      </div>
    );
  }

  if (error) {
    const status =
      (pokemonsErr as FetchBaseQueryError)?.status ||
      (teamsErr as FetchBaseQueryError)?.status ||
      (membersErr as FetchBaseQueryError)?.status ||
      "Erreur inconnue";
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg font-medium">Erreur : {status}</p>
      </div>
    );
  }

  const safePokemons = pokemons ?? [];
  const safeTeams = teams ?? [];
  const safeMembers = members ?? [];

  // Top 3 Pokémon by total stats
  const top3 = [...safePokemons]
    .map((p) => ({ ...p, total: computeTotalStats(p) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  // Type ranking
  const types = typeFrequency(safePokemons);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 font-space-grotesk">
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tableau de bord
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Aperçu général de votre Pokédex
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Pokémons" value={safePokemons.length} color="text-blue-500" />
        <StatCard label="Équipes" value={safeTeams.length} color="text-green-500" />
        <StatCard label="Membres" value={safeMembers.length} color="text-purple-500" />
      </div>

      {/* ── Top 3 Pokémon ── */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          🏆 Top 3 Pokémon (stats totales)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {top3.map((p, idx) => {
            const medals = ["🥇", "🥈", "🥉"];
            return (
              <div
                key={p.id}
                className="rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/60 dark:bg-black/60 backdrop-blur-lg p-5 shadow-lg dark:shadow-gray-900/20 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{medals[idx]}</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded-full">
                    #{idx + 1}
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                  {p.name}
                </p>
                <div className="grid grid-cols-3 gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>HP {p.hp}</span>
                  <span>Atk {p.atk}</span>
                  <span>Def {p.def}</span>
                  <span>AtkSp {p.atk_spe}</span>
                  <span>DefSp {p.def_spe}</span>
                  <span>Spd {p.speed}</span>
                </div>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {p.types.map((t) => (
                    <span
                      key={t.name}
                      className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                      style={{ backgroundColor: t.color }}
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                  Total : <span className="text-lg">{p.total}</span>
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <BarChart pokemons={safePokemons} />
        <TeamTimeline teams={safeTeams} />
      </div>

      {/* ── Type Ranking ── */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          📊 Classement des types
        </h2>
        <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/60 dark:bg-black/60 backdrop-blur-lg p-5 shadow-lg dark:shadow-gray-900/20">
          {types.length === 0 ? (
            <p className="text-gray-400 text-sm">Aucun type trouvé.</p>
          ) : (
            <div className="space-y-3">
              {types.map((t) => {
                const maxCount = types[0].count;
                const pct = (t.count / maxCount) * 100;
                return (
                  <div key={t.name} className="flex items-center gap-3">
                    <span
                      className="w-20 text-xs font-medium text-gray-700 dark:text-gray-200 text-right shrink-0"
                    >
                      {t.name}
                    </span>
                    <div className="flex-1 h-4 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(pct, 2)}%`,
                          backgroundColor: t.color,
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 w-8 text-right shrink-0">
                      {t.count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
