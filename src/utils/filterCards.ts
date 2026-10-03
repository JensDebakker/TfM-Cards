import type { Card, CardType } from '../types/card';

export type SortOrder = 'id' | 'costAsc' | 'costDesc';

export interface CardQuery {
  search: string;
  type: CardType | 'all';
  sort: SortOrder;
}

export const DEFAULT_QUERY: CardQuery = { search: '', type: 'all', sort: 'id' };

export function filterCards(cards: Card[], query: CardQuery): Card[] {
  const needle = query.search.trim().toLowerCase();

  const result = cards.filter((card) => {
    if (query.type !== 'all' && card.type !== query.type) return false;
    if (!needle) return true;
    return card.name.toLowerCase().includes(needle) || card.text.toLowerCase().includes(needle);
  });

  return [...result].sort((a, b) => {
    switch (query.sort) {
      case 'costAsc':
        return a.cost - b.cost || a.id.localeCompare(b.id);
      case 'costDesc':
        return b.cost - a.cost || a.id.localeCompare(b.id);
      default:
        return a.id.localeCompare(b.id, undefined, { numeric: true });
    }
  });
}
