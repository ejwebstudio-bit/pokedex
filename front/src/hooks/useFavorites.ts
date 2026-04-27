'use client';

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'pokedex-favorites';

function getStoredFavorites(): Set<number> {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Set();
    const arr: number[] = JSON.parse(stored);
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function persistFavorites(set: Set<number>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // localStorage might be full or unavailable
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<number>>(getStoredFavorites);

  const isFavorite = useCallback(
    (id: number): boolean => favorites.has(id),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (id: number): void => {
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        persistFavorites(next);
        return next;
      });
    },
    []
  );

  return { favorites, isFavorite, toggleFavorite };
}
