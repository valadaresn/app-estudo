import { useState, useCallback } from 'react';
import { CardData } from '../models/flashCardTypes';
import { splitCard } from '../util/flashCardUtils';

export interface SelectionRange {
  start: number;
  end: number;
}

function useFlashCardActions(
  cards: CardData[],
  setCards: React.Dispatch<React.SetStateAction<CardData[]>>,
  questionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
) {
  // Estados para controle do modal de pergunta
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalInput, setModalInput] = useState<string>('');
  const [originalSelection, setOriginalSelection] = useState<string>('');
  const [selRange, setSelRange] = useState<SelectionRange>({ start: 0, end: 0 });
  const [currentCardIndex, setCurrentCardIndex] = useState<number | null>(null);

  // Estados para controle do modal de edição
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [currentEditCardIndex, setCurrentEditCardIndex] = useState<number | null>(null);

  // Reset dos estados de seleção
  const resetSelectionStates = useCallback(() => {
    setModalInput('');
    setOriginalSelection('');
    setSelRange({ start: 0, end: 0 });
  }, []);

  // Captura informações sobre o texto selecionado
  const captureSelection = useCallback((selection: Selection) => {
    const getSelectedCardIndex = (selection: Selection): number | null => {
      if (!selection || selection.rangeCount === 0) return null;
      const anchorNode = selection.anchorNode;
      for (let i = 0; i < questionRefs.current.length; i++) {
        const ref = questionRefs.current[i];
        if (ref && anchorNode && ref.contains(anchorNode)) {
          return i;
        }
      }
      return null;
    };

    const index = getSelectedCardIndex(selection);
    if (index === null) return null;

    const card = cards[index];
    const ref = questionRefs.current[index];
    if (!ref) return null;

    if (selection.rangeCount === 0 || selection.isCollapsed) return null;

    const range = selection.getRangeAt(0);
    const text = range.toString();
    
    const start = card.plainText.indexOf(text);
    if (start === -1) return null;
    
    return {
      text,
      range: { start, end: start + text.length },
      cardIndex: index
    };
  }, [cards, questionRefs]);


    /**
   * Separa um card em dois a partir dos índices de divisão.
   * 
   * @param card - Card original
   * @param indices - Objeto contendo os índices de divisão para plainText e originalText
   * @returns Tuple [cardAtualizado, novoCard]
   */
   function splitCard(
    card: CardData,
    indices: {
      plainText: number,
      originalText: number
    }
  ): [CardData, CardData] {
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
  }

  

  // Manipulação do modal de perguntar
  const handlePerguntarClickOneButton = useCallback((selection: Selection) => {
    const selectionData = captureSelection(selection);
    if (!selectionData) return;

    setOriginalSelection(selectionData.text);
    setModalInput(selectionData.text);
    setSelRange(selectionData.range);
    setCurrentCardIndex(selectionData.cardIndex);
    setModalOpen(true);
  }, [captureSelection, setOriginalSelection, setModalInput, setSelRange, setCurrentCardIndex, setModalOpen]);

  // Manipulação do fechamento do modal
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setCurrentCardIndex(null);
    resetSelectionStates();
    window.getSelection()?.removeAllRanges();
  }, [resetSelectionStates]);

  // Manipulação da divisão do card
const handleDividirClick = useCallback((selection: Selection) => {
  const selectionData = captureSelection(selection);
  if (!selectionData) return;

  const card = cards[selectionData.cardIndex];
  
  // Novo: calculando o índice em originalText
  const remainingText = card.plainText.substring(selectionData.range.start);
  const originalTextIndex = card.originalText.length - remainingText.length;
  
  // Modificado: passando objeto com ambos os índices
  const [updatedCard, newCard] = splitCard(card, {
    plainText: selectionData.range.start,
    originalText: originalTextIndex
  });

  const newCards = [...cards];
  newCards[selectionData.cardIndex] = updatedCard;
  newCards.splice(selectionData.cardIndex + 1, 0, newCard);
  setCards(newCards);

  window.getSelection()?.removeAllRanges();
}, [cards, setCards, captureSelection]);

  // Manipulação da edição do card
  const handleEditCard = useCallback((index: number) => {
    setCurrentEditCardIndex(index);
    setEditModalOpen(true);
  }, []);

  // Atualização do card após edição
  const handleUpdateCard = useCallback((updatedCard: CardData) => {
    setCards(prevCards => {
      const newCards = [...prevCards];
      const indexToUpdate = currentCardIndex !== null ? currentCardIndex : currentEditCardIndex;
      
      if (indexToUpdate !== null) {
        newCards[indexToUpdate] = updatedCard;
      }
      return newCards;
    });

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
    setCards
  ]);

  // Manipulação da mudança de resposta
  const handleAnswerChange = useCallback((index: number, answer: string) => {
    setCards(prevCards => {
      const newCards = [...prevCards];
      newCards[index].answer = answer;
      return newCards;
    });
  }, [setCards]);

// Adicione esta nova função no useFlashCardActions
const handleDeleteCard = useCallback((index: number) => {
  setCards(prevCards => {
    const newCards = [...prevCards];
    // Se não for o primeiro card, passa o originalText para o card anterior
    if (index > 0) {
      newCards[index - 1].originalText += ' ' + newCards[index].originalText;
    }
    newCards.splice(index, 1);
    return newCards;
  });
  setEditModalOpen(false);
  setCurrentEditCardIndex(null);
}, []);


  return {
    modalOpen,
    setModalOpen: handleCloseModal,
    modalInput,
    setModalInput,
    originalSelection,
    selRange,
    currentCardIndex,
    setCurrentCardIndex,
    editModalOpen,
    setEditModalOpen,
    currentEditCardIndex,
    handlePerguntarClickOneButton,
    handleDividirClick,
    handleEditCard,
    handleUpdateCard,
    handleAnswerChange,
    handleDeleteCard
  };
}

export default useFlashCardActions;