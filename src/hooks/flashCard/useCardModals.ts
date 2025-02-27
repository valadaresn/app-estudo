import { useState, useCallback } from 'react';
import { SelectionData, SelectionRange } from './useCardSelection';

/**
 * Hook para gerenciar modais relacionados aos flashcards
 */
function useCardModals() {
  // Estados para controle do modal de pergunta
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalInput, setModalInput] = useState<string>('');
  const [originalSelection, setOriginalSelection] = useState<string>('');
  const [selRange, setSelRange] = useState<SelectionRange>({ start: 0, end: 0 });
  const [currentCardIndex, setCurrentCardIndex] = useState<number | null>(null);

  // Estados para controle do modal de edição
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [currentEditCardIndex, setCurrentEditCardIndex] = useState<number | null>(null);

  /**
   * Reset dos estados de seleção
   */
  const resetSelectionStates = useCallback(() => {
    setModalInput('');
    setOriginalSelection('');
    setSelRange({ start: 0, end: 0 });
  }, []);

  /**
   * Manipulação do modal de perguntar
   */
  const handlePerguntarClickOneButton = useCallback((selectionData: SelectionData | null) => {
    if (!selectionData) return;

    setOriginalSelection(selectionData.text);
    setModalInput(selectionData.text);
    setSelRange(selectionData.range);
    setCurrentCardIndex(selectionData.cardIndex);
    setModalOpen(true);
  }, []);

  /**
   * Manipulação do fechamento do modal de pergunta
   */
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setCurrentCardIndex(null);
    resetSelectionStates();
    window.getSelection()?.removeAllRanges();
  }, [resetSelectionStates]);

  return {
    // Estados
    modalOpen,
    modalInput,
    originalSelection,
    selRange,
    currentCardIndex,
    editModalOpen,
    currentEditCardIndex,
    
    // Setters
    setModalInput,
    setCurrentCardIndex,
    setEditModalOpen,
    setCurrentEditCardIndex,
    
    // Handlers
    handlePerguntarClickOneButton,
    handleCloseModal,
    resetSelectionStates
  };
}

export default useCardModals;