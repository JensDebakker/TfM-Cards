import type { Card, CardDataset } from '../types/card';
import cardsJson from './cards.json';

/**
 * The only way the UI reads card data. Stage 1 implements it with the bundled
 * JSON; Stage 2 adds an HTTP implementation that calls the Spring Boot API.
 */
export interface CardRepository {
  listCards(): Promise<Card[]>;
  getCard(id: string): Promise<Card | undefined>;
}

export class JsonCardRepository implements CardRepository {
  private readonly cards: Card[];

  constructor(dataset: CardDataset = cardsJson as CardDataset) {
    if (dataset.schemaVersion !== 1) {
      throw new Error(`Unsupported card dataset schemaVersion: ${dataset.schemaVersion}`);
    }
    this.cards = dataset.cards;
  }

  async listCards(): Promise<Card[]> {
    return this.cards;
  }

  async getCard(id: string): Promise<Card | undefined> {
    return this.cards.find((card) => card.id === id);
  }
}

export const cardRepository: CardRepository = new JsonCardRepository();
