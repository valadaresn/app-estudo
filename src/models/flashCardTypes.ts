export interface Annotation {
  start: number;
  end: number;
  style: string;
}

export interface CardData {
  plainText: string;
  originalText: string;  
  answer: string;
}

export interface FlashCardForm {
  cards: CardData[];
}