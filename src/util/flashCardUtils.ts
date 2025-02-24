import { CardData } from '../models/flashCardTypes';

/**
 * Atualiza um card após a ação de edição.
 * Substitui o trecho selecionado pelo novo texto envolvido por marcadores markdown.
 *
 * @param card - Card original.
 * @param selRange - Objeto com os offsets inicial e final da seleção.
 * @param modalInput - Novo texto inserido no modal.
 * @param originalSelection - Trecho originalmente selecionado.
 * @returns CardData atualizado.
 */
export function modifyCardText(
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

  return {
    plainText: newPlainText,
    originalText: card.originalText,
    answer: originalSelection
  };
}

/**
 * Separa um card em dois a partir de um índice de divisão.
 *
 * Divide o card original em:
 * - Um card com o texto anterior à divisão
 * - Um novo card com o texto após o índice
 *
 * @param card - Card original.
 * @param splitIndex - Índice onde o texto será dividido.
 * @returns Tuple contendo o card atualizado e o novo card.
 */
export function splitCard(
  card: CardData,
  splitIndex: number
): [CardData, CardData] {
  // Antes havia .trim(), agora removemos para manter o texto exato
  const beforeText = card.plainText.substring(0, splitIndex);
  const afterText = card.plainText.substring(splitIndex);

  const originalBeforeText = card.originalText.substring(0, splitIndex);
  const originalAfterText = card.originalText.substring(splitIndex);

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