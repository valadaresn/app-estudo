import { CardData, Annotation } from '../models/flashCardTypes';

/**
 * Atualiza um card após a ação de edição.
 *
 * Substitui o trecho selecionado pelo novo texto (envolvido por marcadores) 
 * e atualiza as anotações, mantendo aquelas que não interferiram na seleção.
 *
 * @param card - Card original.
 * @param selRange - Objeto com os offsets inicial e final da seleção.
 * @param modalInput - Novo texto inserido no modal.
 * @param originalSelection - Trecho originalmente selecionado.
 * @returns CardData atualizado.
 */
export function updateCardAfterEdit(
  card: CardData,
  selRange: { start: number; end: number },
  modalInput: string,
  originalSelection: string
): CardData {
  const replacedText = `{${modalInput}}`;
  const newPlainText =
    card.plainText.substring(0, selRange.start) +
    replacedText +
    card.plainText.substring(selRange.end);

  const newAnnotation: Annotation = {
    start: selRange.start,
    end: selRange.start + replacedText.length,
    style: 'orange'
  };

  const filteredAnnotations = card.annotations.filter(
    (a) => a.end <= selRange.start || a.start >= selRange.end
  );

  const newAnnotations = [...filteredAnnotations, newAnnotation].sort((a, b) => a.start - b.start);

  return {
    plainText: newPlainText,
    annotations: newAnnotations,
    answer: originalSelection
  };
}

/**
 * Separa um card em dois a partir de um índice de divisão.
 *
 * Divide o card original em:
 * - Um card com o texto anterior à divisão, mantendo as anotações que não ultrapassam o índice.
 * - Um novo card com o texto após o índice, sem anotações e resposta vazia.
 *
 * @param card - Card original.
 * @param splitIndex - Índice onde o texto será dividido.
 * @returns Tuple contendo o card atualizado e o novo card.
 */
export function splitCard(
  card: CardData,
  splitIndex: number
): [CardData, CardData] {
  const beforeText = card.plainText.substring(0, splitIndex);
  const afterText = card.plainText.substring(splitIndex);

  const updatedCard: CardData = {
    plainText: beforeText,
    annotations: card.annotations.filter(a => a.end <= splitIndex),
    answer: card.answer
  };

  const newCard: CardData = {
    plainText: afterText,
    annotations: [],
    answer: ''
  };

  return [updatedCard, newCard];
}