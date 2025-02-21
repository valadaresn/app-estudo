import { useState } from 'react';
import { CardData } from '../models/flashCardTypes';
import { getOffsetInPlainText } from '../util/textUtils';
import { updateCardAfterEdit, splitCard } from '../util/flashCardUtils';

export type ActionType = 'edit';

export interface SelectionRange {
  start: number;
  end: number;
}

/**
 * Hook para gerenciar as ações do FlashCard, como seleção, edição e divisão de cards.
 *
 * Recebe os cards atuais, a função para atualizá-los e as referências dos elementos dos cards.
 */
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
  const [actionType, setActionType] = useState<ActionType>('edit');

  const getSelectedCardIndex = (): number | null => {
    const selection = window.getSelection();
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

  const handleSelection = (
    evt: React.MouseEvent<HTMLButtonElement>,
    action: ActionType
  ) => {
    evt.preventDefault();
    const index = getSelectedCardIndex();
    if (index === null) return;
    const card = cards[index];
    const ref = questionRefs.current[index];
    if (!ref) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

    const container = ref;
    const startOffset = getOffsetInPlainText(
      container,
      selection.anchorNode!,
      selection.anchorOffset
    );
    const endOffset = getOffsetInPlainText(
      container,
      selection.focusNode!,
      selection.focusOffset
    );
    if (startOffset === endOffset) return;

    const s = Math.min(startOffset, endOffset);
    const e = Math.max(startOffset, endOffset);
    const selectedText = card.plainText.substring(s, e);
    setOriginalSelection(selectedText);
    setModalInput(selectedText);
    setSelRange({ start: s, end: e });
    setCurrentCardIndex(index);
    setActionType(action);
    setModalOpen(true);
  };

  const handlePerguntarClickOneButton = (evt: React.MouseEvent<HTMLButtonElement>) => {
    handleSelection(evt, 'edit');
  };

  const handleDividirClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    const index = getSelectedCardIndex();
    if (index === null) return;
    const card = cards[index];
    const ref = questionRefs.current[index];
    if (!ref) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

    const container = ref;
    const startOffset = getOffsetInPlainText(
      container,
      selection.anchorNode!,
      selection.anchorOffset
    );
    // Utiliza a função splitCard para separar o card em dois
    const [updatedCard, newCard] = splitCard(card, startOffset);
    const newCards = [...cards];
    newCards[index] = updatedCard;
    newCards.splice(index + 1, 0, newCard);
    setCards(newCards);

    window.getSelection()?.removeAllRanges();
  };

  const handleModalOk = () => {
    if (currentCardIndex === null) return;
    const card = cards[currentCardIndex];
    if (actionType === 'edit') {
      const newCard = updateCardAfterEdit(card, selRange, modalInput, originalSelection);
      const newCards = [...cards];
      newCards[currentCardIndex] = newCard;
      setCards(newCards);
    }
    setModalOpen(false);
    setCurrentCardIndex(null);
  };

  return {
    modalOpen,
    setModalOpen,
    modalInput,
    setModalInput,
    originalSelection,
    selRange,
    currentCardIndex,
    actionType,
    handlePerguntarClickOneButton,
    handleDividirClick,
    handleModalOk
  };
}

export default useFlashCardActions;