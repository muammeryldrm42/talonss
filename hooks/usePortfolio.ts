'use client';

import { useState, useCallback, useEffect } from 'react';
import type { PortfolioEntry } from '@/types/portfolio';

const STORAGE_KEY = 'talons_portfolio';

function loadFromStorage(): PortfolioEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveToStorage(entries: PortfolioEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>([]);

  // Hydrate from localStorage after mount
  useEffect(() => {
    setPortfolio(loadFromStorage());
  }, []);

  const add = useCallback((entry: PortfolioEntry) => {
    setPortfolio((prev) => {
      if (prev.some((e) => e.id === entry.id)) return prev;
      const next = [...prev, entry];
      saveToStorage(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setPortfolio((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveToStorage(next);
      return next;
    });
  }, []);

  const update = useCallback((id: string, patch: Partial<PortfolioEntry>) => {
    setPortfolio((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...e, ...patch } : e));
      saveToStorage(next);
      return next;
    });
  }, []);

  const has = useCallback(
    (id: string) => portfolio.some((e) => e.id === id),
    [portfolio],
  );

  return { portfolio, add, remove, update, has };
}
