import { useState, useEffect, RefObject } from 'react';

export interface SelectionRange {
  start: number;
  end: number;
}

export function useTextSelection(ref: RefObject<HTMLElement>): SelectionRange | null {
  const [selectionRange, setSelectionRange] = useState<SelectionRange | null>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && ref.current?.contains(selection.anchorNode)) {
        const range = selection.getRangeAt(0);
        setSelectionRange({
          start: range.startOffset,
          end: range.endOffset,
        });
      } else {
        setSelectionRange(null);
      }
    };

    document.addEventListener('mouseup', handleSelectionChange);
    document.addEventListener('touchend', handleSelectionChange);

    return () => {
      document.removeEventListener('mouseup', handleSelectionChange);
      document.removeEventListener('touchend', handleSelectionChange);
    };
  }, [ref]);

  return selectionRange;
}