import { useCallback } from 'react';
import { CardData } from '../../models/flashCardTypes';

export interface SelectionRange {
  start: number;
  end: number;
}

export interface SelectionData {
  text: string;
  range: SelectionRange;
  cardIndex: number;
}

/**
 * Hook para lidar com seleção de texto em cards
 */
function useCardSelection(
  cards: CardData[],
  questionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
) {
  /**
   * Captura informações sobre o texto selecionado
   */
  const 
  captureSelection = useCallback(
    (selection: Selection): SelectionData | null => {
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
    },
    [cards, questionRefs]
  );

  /**
   * Limpa qualquer seleção atual do usuário
   */
  const clearSelection = useCallback(() => {
    window.getSelection()?.removeAllRanges();
  }, []);

  return {
    captureSelection,
    clearSelection
  };
}

export default useCardSelection;