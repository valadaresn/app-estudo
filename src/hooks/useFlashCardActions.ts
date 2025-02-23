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
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalInput, setModalInput] = useState<string>('');
  const [originalSelection, setOriginalSelection] = useState<string>('');
  const [selRange, setSelRange] = useState<SelectionRange>({ start: 0, end: 0 });
  const [currentCardIndex, setCurrentCardIndex] = useState<number | null>(null);

  // Função para resetar todos os estados relacionados à seleção
  const resetSelectionStates = useCallback(() => {
    setModalInput('');
    setOriginalSelection('');
    setSelRange({ start: 0, end: 0 });
  }, []);

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

  const captureSelection = (selection: Selection) => {
    const index = getSelectedCardIndex(selection);
    if (index === null) return null;

    const card = cards[index];
    const ref = questionRefs.current[index];
    if (!ref) return null;

    if (selection.rangeCount === 0 || selection.isCollapsed) return null;

    const range = selection.getRangeAt(0);
    const text = range.toString();
    
    // Encontra a posição do texto selecionado dentro do texto completo do card
    const start = card.plainText.indexOf(text);
    if (start === -1) return null;
    
    return {
      text,
      range: { start, end: start + text.length },
      cardIndex: index
    };
  };

  const handlePerguntarClickOneButton = (selection: Selection) => {
    const selectionData = captureSelection(selection);
    if (!selectionData) return;

    setOriginalSelection(selectionData.text);
    setModalInput(selectionData.text);
    setSelRange(selectionData.range);
    setCurrentCardIndex(selectionData.cardIndex);
    setModalOpen(true);
  };

  const handleDividirClick = (selection: Selection) => {
    const selectionData = captureSelection(selection);
    if (!selectionData) return;

    const card = cards[selectionData.cardIndex];
    const [updatedCard, newCard] = splitCard(card, selectionData.range.start);
    const newCards = [...cards];
    newCards[selectionData.cardIndex] = updatedCard;
    newCards.splice(selectionData.cardIndex + 1, 0, newCard);
    setCards(newCards);

    window.getSelection()?.removeAllRanges();
  };

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setCurrentCardIndex(null);
    resetSelectionStates();
    window.getSelection()?.removeAllRanges();
  }, [resetSelectionStates]);

  return {
    modalOpen,
    setModalOpen: handleCloseModal, // Substituído pelo handler que faz cleanup
    modalInput,
    setModalInput,
    originalSelection,
    selRange,
    currentCardIndex,
    setCurrentCardIndex,
    handlePerguntarClickOneButton,
    handleDividirClick,
    handleAnswerChange: (index: number, answer: string) => {
      setCards(prevCards => {
        const newCards = [...prevCards];
        newCards[index].answer = answer;
        return newCards;
      });
    }
  };
}

export default useFlashCardActions;