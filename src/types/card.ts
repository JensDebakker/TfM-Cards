export type CardType =
  | 'automated'
  | 'active'
  | 'event'
  | 'corporation'
  | 'prelude'
  | 'colony'
  | 'globalEvent';

export type Tag =
  | 'building'
  | 'space'
  | 'science'
  | 'plant'
  | 'microbe'
  | 'animal'
  | 'power'
  | 'earth'
  | 'jovian'
  | 'city'
  | 'venus'
  | 'event'
  | 'wild';

export type Resource = 'megacredits' | 'steel' | 'titanium' | 'plants' | 'energy' | 'heat';

export interface Card {
  /** Stable identifier, e.g. "001", "P36", "C01". Used as the route param. */
  id: string;
  name: string;
  type: CardType;
  /** Expansion or set the card belongs to, e.g. "base", "venus". */
  set: string;
  cost: number;
  tags: Tag[];
  /** Play condition, e.g. "max 5% oxygen". */
  requirements?: string;
  /** Production changes; negative values are production decreases. */
  production?: Partial<Record<Resource, number>>;
  vp?: number;
  /** Card effect text. */
  text: string;
}

/** Shape of the bundled JSON file and of the future API response envelope. */
export interface CardDataset {
  schemaVersion: 1;
  cards: Card[];
}
