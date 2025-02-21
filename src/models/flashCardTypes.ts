export interface Annotation {
  start: number;
  end: number;
  style: string;
}

export interface CardData {
  plainText: string;
  annotations: Annotation[];
  answer: string;
}

export interface FlashCardForm {
  cards: CardData[];
}