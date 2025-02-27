import { useCallback } from 'react';
import { CardData } from '../../models/flashCardTypes';

/**
 * Hook para gerenciar a edição de flashcards
 */
function useCardEditing(
  setCards: React.Dispatch<React.SetStateAction<CardData[]>>,
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  currentCardIndex: number | null,
  setCurrentCardIndex: React.Dispatch<React.SetStateAction<number | null>>,
  currentEditCardIndex: number | null,
  setCurrentEditCardIndex: React.Dispatch<React.SetStateAction<number | null>>,
  resetSelectionStates: () => void
) {
  /**
   * Abre o modal de edição para um card específico
   */
  const handleEditCard = useCallback((index: number) => {
    setCurrentEditCardIndex(index);
    setEditModalOpen(true);
  }, [setCurrentEditCardIndex, setEditModalOpen]);

  /**
   * Atualiza um card após edição e fecha o modal correspondente
   */
  const handleUpdateCard = useCallback((updatedCard: CardData) => {
    setCards(prevCards => {
      const newCards = [...prevCards];
      // Identifica qual índice deve ser atualizado (pergunta ou edição)
      const indexToUpdate = currentCardIndex !== null ? currentCardIndex : currentEditCardIndex;
      
      if (indexToUpdate !== null) {
        newCards[indexToUpdate] = updatedCard;
      }
      return newCards;
    });

    // Fecha o modal apropriado com base no contexto
    if (currentCardIndex !== null) {
      setModalOpen(false);
      setCurrentCardIndex(null);
      resetSelectionStates();
    } else if (currentEditCardIndex !== null) {
      setEditModalOpen(false);
      setCurrentEditCardIndex(null);
    }
  }, [
    currentCardIndex, 
    currentEditCardIndex, 
    setModalOpen, 
    setEditModalOpen, 
    resetSelectionStates,
    setCards,
    setCurrentCardIndex,
    setCurrentEditCardIndex
  ]);

  /**
   * Manipula a alteração da resposta de um card
   */
  const handleAnswerChange = useCallback((index: number, answer: string) => {
    setCards(prevCards => {
      const newCards = [...prevCards];
      newCards[index].answer = answer;
      return newCards;
    });
  }, [setCards]);

  return {
    handleEditCard,
    handleUpdateCard,
    handleAnswerChange
  };
}

export default useCardEditing;