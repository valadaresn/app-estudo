import { useCallback } from 'react';
import { CardData } from '../../models/flashCardTypes';
import { SelectionData } from './useCardSelection';

/**
 * Hook para gerenciar a divisão de flashcards
 */
function useCardSplitting(
  cards: CardData[],
  setCards: React.Dispatch<React.SetStateAction<CardData[]>>,
  captureSelection: (selection: Selection) => SelectionData | null
) {
  /**
   * Separa um card em dois a partir dos índices de divisão.
   * 
   * @param card - Card original
   * @param indices - Objeto contendo os índices de divisão para plainText e originalText
   * @returns Tuple [cardAtualizado, novoCard]
   */
  const splitCard = useCallback(
    (
      card: CardData,
      indices: {
        plainText: number,
        originalText: number
      }
    ): [CardData, CardData] => {
      const beforeText = card.plainText.substring(0, indices.plainText);
      const afterText = card.plainText.substring(indices.plainText);
    
      const originalBeforeText = card.originalText.substring(0, indices.originalText);
      const originalAfterText = card.originalText.substring(indices.originalText);
    
      const updatedCard: CardData = {
        plainText: beforeText,
        originalText: originalBeforeText,
        answer: card.answer
      };
    
      const newCard: CardData = {
        plainText: afterText,
        originalText: originalAfterText,
        answer: ''
      };
    
      return [updatedCard, newCard];
    },
    []
  );

  /**
   * Manipula a divisão de um card quando o usuário seleciona texto e clica em dividir
   */
  const handleDividirClick = useCallback((selection: Selection) => {
    const selectionData = captureSelection(selection);
    if (!selectionData) return;

    const card = cards[selectionData.cardIndex];
    
    // Calculando o índice em originalText
    const remainingText = card.plainText.substring(selectionData.range.start);
    const originalTextIndex = card.originalText.length - remainingText.length;
    
    // Passando objeto com ambos os índices
    const [updatedCard, newCard] = splitCard(card, {
      plainText: selectionData.range.start,
      originalText: originalTextIndex
    });

    const newCards = [...cards];
    newCards[selectionData.cardIndex] = updatedCard;
    newCards.splice(selectionData.cardIndex + 1, 0, newCard);
    setCards(newCards);

    window.getSelection()?.removeAllRanges();
  }, [cards, setCards, captureSelection, splitCard]);

  return {
    splitCard,
    handleDividirClick
  };
}

export default useCardSplitting;