import React from 'react';
import { Grid } from '@mui/material';
import { CardData } from '../../models/flashCardTypes';
import FlashCardItem from './FlashCardItem';

interface FlashCardListProps {
  cards: CardData[];
  questionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  onEdit: (card: CardData) => void;
  onAnswerChange: (index: number, answer: string) => void;
}

/**
 * FlashCardList renderiza a lista de flashcards.
 * Para cada card, o FlashCardItem é utilizado, recebendo o objeto "card" individual.
 */
const FlashCardList: React.FC<FlashCardListProps> = ({ cards, questionRefs, onEdit, onAnswerChange }) => {
  return (
    <Grid container spacing={2}>
      {cards.map((card, index) => (
        <FlashCardItem
          key={index}
          card={card}                          // <--- Aqui é 'card', não 'cards'
          index={index}
          questionRefs={questionRefs}
          onEdit={onEdit}
          onAnswerChange={onAnswerChange}
        />
      ))}
    </Grid>
  );
};

export default FlashCardList;