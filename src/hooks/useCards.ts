import { useEffect, useState } from 'react';
import { cardRepository } from '../data/cardRepository';
import type { Card } from '../types/card';

export function useCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    cardRepository
      .listCards()
      .then((result) => {
        if (!cancelled) setCards(result);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { cards, error, loading };
}
