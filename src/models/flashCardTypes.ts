export interface Annotation {
  start: number;
  end: number;
  style: string;
}

export interface CardData {
  id?: string;              // ID no Firebase (opcional para novos)
  leiId?: string;           // ID da lei relacionada
  plainText: string;        // Conteúdo principal (frente)
  originalText: string;     // Texto original sem modificações
  answer: string;           // Resposta/explicação (verso)
  criado?: any;             // Data de criação
  modificado?: any;         // Data de última modificação
}

export interface FlashCardForm {
  cards: CardData[];
}