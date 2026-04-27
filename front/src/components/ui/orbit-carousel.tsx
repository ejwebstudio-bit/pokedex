"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Trash } from "lucide-react";
import type { Pokemon } from "@/store/api/pokemonApi";





// --- Utility for fallback images ---
const safeImage = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  target.src = "https://placehold.co/100x100/E0E7FF/4338CA?text=Error";
};

// --- Custom hook for mobile detection ---
const useIsMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkScreenSize = (): void => setIsMobile(window.innerWidth < breakpoint);
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [breakpoint]);
  
  return isMobile;
};

interface TeamMembersProps {
  teamMembers?: Pokemon[],
  onRemovePokemon?: (pokemonId: number) => void,
}


// --- Main Component ---
export default function OrbitCarousel({teamMembers = [], onRemovePokemon}:TeamMembersProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const isMobile = useIsMobile();

  const containerRadius = isMobile ? 130 : 200;
  const profileSize = isMobile ? 60 : 80;
  const containerSize = containerRadius * 2 + 100;

  // Calculate rotation for each profile
  const getRotation = React.useCallback(
    (index: number): number => (index - activeIndex) * (360 / teamMembers.length),
    [activeIndex, teamMembers]
  );

  // Navigation
  const next = React.useCallback(
    () => setActiveIndex((i) => (i + 1) % teamMembers.length),
    [teamMembers.length]
  );
  const prev = React.useCallback(
    () => setActiveIndex((i) => (i - 1 + teamMembers.length) % teamMembers.length),
    [teamMembers.length]
  );

  const handleProfileClick = React.useCallback((index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
  }, [activeIndex]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'ArrowLeft') prev();
      else if (event.key === 'ArrowRight') next();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  // If there are no team members, render a small placeholder to avoid accessing undefined.
  if (teamMembers.length === 0) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">No team members available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 relative min-h-[400px] bg-white dark:bg-black transition-colors duration-300">

      <div
        className="relative flex items-center justify-center"
        style={{ width: containerSize, height: containerSize }}
      >
        {/* Single orbit circle */}
        <div
          className="absolute rounded-full border border-gray-300 dark:border-gray-700"
          style={{
            width: containerRadius * 2,
            height: containerRadius * 2,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Active Person Card - Smaller size */}
        <AnimatePresence mode="wait">
          <motion.div
            key={teamMembers[activeIndex].id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: 0.3,
              ease: "easeInOut"
            }}
            className="z-10 bg-white dark:bg-gray-950 backdrop-blur-sm shadow-xl dark:shadow-2xl dark:shadow-gray-900/50 rounded-xl p-3 md:p-4 w-48 md:w-52 text-center border border-gray-100 dark:border-gray-800"
          >
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              src={`/img/${teamMembers[activeIndex].id}.webp`}
              alt={teamMembers[activeIndex].name}
              onError={safeImage}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto -mt-10 md:-mt-12 border-4 border-white dark:border-black object-cover shadow-md"
            />
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <h2 className="mt-2 text-base md:text-lg font-bold text-gray-800 dark:text-white">
                {teamMembers[activeIndex].name}
              </h2>
              <div className="flex items-center justify-center text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                <Heart size={12} className="mr-1" /> 
                <span className="truncate">{teamMembers[activeIndex].hp}</span>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex justify-center items-center mt-3 space-x-2"
            >
              <button
                onClick={prev}
                className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft size={16} className="text-gray-700 dark:text-gray-300" />
              </button>
              <button className="px-4 py-1 text-sm rounded-full bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors">
                Connect
              </button>
              <button
                onClick={next}
                className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronRight size={16} className="text-gray-700 dark:text-gray-300" />
              </button>
            </motion.div>
            {onRemovePokemon && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.25 }}
                className="mt-3"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemovePokemon(teamMembers[activeIndex].id);
                  }}
                  className="flex items-center justify-center gap-1 w-full py-1.5 text-xs rounded-full bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50 transition-colors"
                >
                  <Trash size={12} />
                  Retirer
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Orbiting Profiles with Counter-Rotation */}
        {teamMembers.map((p, i) => {
          const rotation = getRotation(i);
          const imageUrl = `./img/${p.id}.webp`
          return (
            <motion.div
              key={p.id}
              animate={{
                transform: `rotate(${rotation}deg) translateY(-${containerRadius}px)`,
              }}
              transition={{
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              style={{
                width: profileSize,
                height: profileSize,
                position: "absolute",
                top: `calc(50% - ${profileSize / 2}px)`,
                left: `calc(50% - ${profileSize / 2}px)`,
              }}
            >
              {/* Counter-rotation to keep image upright */}
              <motion.div
                animate={{ rotate: -rotation }}
                transition={{
                  duration: 0.8,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                className="w-full h-full"
              >
                <motion.img
                  src={imageUrl}
                  alt={p.name}
                  onError={safeImage}
                  onClick={() => handleProfileClick(i)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full h-full object-cover rounded-full cursor-pointer transition-all duration-300 ${
                    i === activeIndex 
                      ? "border-4 border-indigo-500 dark:border-indigo-400 shadow-lg" 
                      : "border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500"
                  }`}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}