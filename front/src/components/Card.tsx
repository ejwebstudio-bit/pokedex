'use client'

import type { Pokemon } from '@/store/api/pokemonApi';
import { Badge } from './ui/badge';
import { Heart } from "lucide-react";
import { useFavorites } from '@/hooks/useFavorites';


interface CardProps {
  onClick?: () => void;
  pokemon: Pokemon
};


export default function Card ({ onClick, pokemon }: CardProps) {
  
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(pokemon.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(pokemon.id);
  };

  return (
    <div onClick={onClick} className="cursor-pointer relative group overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-black/20 transition-all duration-300 hover:shadow-xl hover:shadow-gray-300/50 dark:hover:shadow-black/40 hover:-translate-y-1 hover:border-gray-300 dark:hover:border-gray-700 w-full font-space-grotesk">
      <div className="relative p-2 sm:p-2.5">
            
          {/* Card Image Section */}
          <div className="relative">
            <img  src={`./img/${pokemon.id}.webp`} alt={pokemon.name} className="shadow-2xl  rounded-xl sm:rounded-2xl object-cover aspect-square w-32 h-32" />
            <div className="flex gap-2 absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/70 dark:bg-black/70 text-white p-1.5 sm:p-2.5 rounded-full transition-colors hover:text-red-500 backdrop-blur-sm border border-white/20">
              <Heart
                className="w-4 h-4 sm:w-6 sm:h-6 cursor-pointer"
                fill={favorite ? '#ef4444' : 'none'}
                color={favorite ? '#ef4444' : 'currentColor'}
                onClick={handleFavoriteClick}
              />
              <p className="text-xs sm:text-sm text-white dark:text-gray-400 mt-1">{pokemon.hp}</p>
            </div>
          </div>

          {/* Card Content Section */}
          <div className="mt-3 sm:mt-4 px-1 sm:px-1.5 pb-2 sm:pb-3 pt-1 sm:pt-2">
            <div className="flex top-2 justify-between items-center">
              <div>
                <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate pr-2" title={pokemon.name}>{pokemon.name}</h3></div>
                <div className='justify-between gap-1'>
                {pokemon.types.map((type) => (
                <Badge className="shadow-sm border-2 shadow-accent-foreground" style={{ backgroundColor: `#${type.color}` }} key={type.id}>{type.name}</Badge>))}
                </div>
              </div>
                  <div className="mt-3 sm:mt-4 flex justify-between items-center">
                    <p className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">Attaque</p>
                    <p className="text-sm sm:text-lg font-bold text-cyan-600 dark:text-cyan-400">{pokemon.atk}</p>
                  </div>
                  <div className="mt-3 sm:mt-4 flex justify-between items-center">
                    <p className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">Défense</p>
                    <p className="text-sm sm:text-lg font-bold text-cyan-600 dark:text-cyan-400">{pokemon.def}</p>
                  </div>
                  <div className="mt-3 sm:mt-4 flex justify-between items-center">
                    <p className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">Attaque spéciale</p>
                    <p className="text-sm sm:text-lg font-bold text-cyan-600 dark:text-cyan-400">{pokemon.atk_spe}</p>
                  </div>
                  <div className="mt-3 sm:mt-4 flex justify-between items-center">
                    <p className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">Défense spéciale</p>
                    <p className="text-sm sm:text-lg font-bold text-cyan-600 dark:text-cyan-400">{pokemon.def_spe}</p>
                  </div>
                  <div className="mt-3 sm:mt-4 flex justify-between items-center">
                    <p className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">Speed</p>
                    <p className="text-sm sm:text-lg font-bold text-cyan-600 dark:text-cyan-400">{pokemon.speed}</p>
                  </div>
                </div>
            </div>
          </div>
  );
};