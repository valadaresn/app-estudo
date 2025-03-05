import { useState, useRef, useEffect, useCallback } from 'react';
import { CardData } from '../../models/flashCardTypes';
import useCardSelection from './useCardSelection';
import useCardModals from './useCardModals';
import useCardEditing from './useCardEditing';
import useCardSplitting from './useCardSplitting';
import useCardDelete from './useCardDelete';

interface UseFlashCardsProps {
  defaultQuestion: string;
  reset?: (data: any) => void;
}

/**
 * Hook central para gerenciar toda a lógica dos FlashCards
 */
function useFlashCards({ defaultQuestion, reset }: UseFlashCardsProps) {
  // Estado dos cards
  const [cards, setCards] = useState<CardData[]>([
    { plainText: defaultQuestion, originalText: defaultQuestion, answer: '' }
  ]);
  
  // Referências aos elementos de cada card
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Inicializa os hooks secundários
  const { captureSelection, clearSelection } = useCardSelection(cards, questionRefs);
  
  const { 
    modalOpen, 
    modalInput, 
    originalSelection,
    selRange,
    currentCardIndex,
    editModalOpen,
    currentEditCardIndex,
    setCurrentCardIndex,
    setEditModalOpen,
    setCurrentEditCardIndex,
    handlePerguntarClickOneButton: handleModalOpen,
    handleCloseModal,
    resetSelectionStates
  } = useCardModals();
  
  const { 
    handleEditCard, 
    handleUpdateCard, 
    handleAnswerChange 
  } = useCardEditing(
    setCards,
    handleCloseModal,
    setEditModalOpen,
    currentCardIndex,
    setCurrentCardIndex,
    currentEditCardIndex,
    setCurrentEditCardIndex,
    resetSelectionStates
  );
  
  const { handleDividirClick } = useCardSplitting(
    cards,
    setCards,
    captureSelection
  );
  
  const { handleDeleteCard } = useCardDelete(
    setCards,
    setEditModalOpen,
    setCurrentEditCardIndex
  );

  // Wrapper para lidar com a seleção antes de abrir o modal de perguntas
  const handlePerguntarClick = useCallback((selection: Selection) => {
    const selectionData = captureSelection(selection);
    if (selectionData) {
      handleModalOpen(selectionData);
    }
  }, [captureSelection, handleModalOpen]);

  // Wrapper para manipular a divisão de cards
  const handleDividir = useCallback((selection: Selection) => {
    handleDividirClick(selection);
  }, [handleDividirClick]);

  // Efeito para sincronização com react-hook-form
  useEffect(() => {
    if (reset) {
      reset({ cards });
    }
  }, [cards, reset]);

  // Efeito para atualização quando o defaultQuestion muda
  useEffect(() => {
    const newCards = [
      { plainText: defaultQuestion, originalText: defaultQuestion, answer: '' }
    ];
    setCards(newCards);
    if (reset) {
      reset({ cards: newCards });
    }
  }, [defaultQuestion, reset]);

  return {
    // Estados
    cards,
    questionRefs,
    modalOpen,
    modalInput,
    originalSelection,
    selRange,
    currentCardIndex,
    editModalOpen,
    currentEditCardIndex,
    
    // Métodos
    handlePerguntarClick,
    handleDividir,
    handleEditCard,
    handleUpdateCard,
    handleAnswerChange,
    handleDeleteCard,
    handleCloseModal,
    clearSelection
  };
}

export default useFlashCards;