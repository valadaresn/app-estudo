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
   * Ao deletar um card, restaura-se o estado anterior à divisão:
   * - O originalText do card deletado vai para o originalText do card anterior
   * - O originalText do card deletado também vai para o plainText do card anterior
   */
  const handleDeleteCard = useCallback((index: number) => {
    setCards(prevCards => {
      const newCards = [...prevCards];
      // Se não for o primeiro card, combina os textos com o card anterior
      if (index > 0) {
        // Adiciona o originalText do card sendo deletado ao originalText do card anterior
        newCards[index - 1].originalText += ' ' + newCards[index].originalText;
        
        // Adiciona o originalText do card sendo deletado ao plainText do card anterior
        // Isso restaura o estado antes da divisão do card
        newCards[index - 1].plainText += ' ' + newCards[index].originalText;
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