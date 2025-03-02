import { useCallback } from 'react';
import { CardData } from '../../models/flashCardTypes';

/**
 * Hook para gerenciar a exclusão de flashcards
 */
function useCardDelete(
  setCards: React.Dispatch<React.SetStateAction<CardData[]>>,
  setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentEditCardIndex: React.Dispatch<React.SetStateAction<number | null>>
) {
  /**
   * Manipula a exclusão de um card
   */
  const handleDeleteCard = useCallback((index: number) => {
    setCards(prevCards => {
      const newCards = [...prevCards];
      
      if (index > 0) {
        const previousCard = newCards[index - 1];
        const cardToDelete = newCards[index];
        const textToAdd = cardToDelete.originalText;
        
        // Adiciona texto ao originalText apenas se não existir
        if (!previousCard.originalText.includes(textToAdd)) {
          previousCard.originalText += ' ' + textToAdd;
        }
        
        // Adiciona texto ao plainText apenas se não existir
        if (!previousCard.plainText.includes(textToAdd)) {
          previousCard.plainText += ' ' + textToAdd;
        }
      }
      
      newCards.splice(index, 1);
      return newCards;
    });
    
    // Fecha modal de edição se estiver aberto
    setEditModalOpen(false);
    setCurrentEditCardIndex(null);
  }, [setCards, setEditModalOpen, setCurrentEditCardIndex]);

  return {
    handleDeleteCard
  };
}

export default useCardDelete;