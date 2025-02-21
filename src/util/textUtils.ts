import { Annotation } from '../models/flashCardTypes';

export function formatText(plainText: string, annotations: Annotation[]): string {
  let formatted = "";
  let lastIndex = 0;
  const sortedAnnotations = [...annotations].sort((a, b) => a.start - b.start);

  sortedAnnotations.forEach(({ start, end, style }) => {
    formatted += plainText.substring(lastIndex, start);
    formatted += `<span style="color: ${style};">${plainText.substring(start, end)}</span>`;
    lastIndex = end;
  });
  
  formatted += plainText.substring(lastIndex);
  return formatted;
}

export function getOffsetInPlainText(container: Node, target: Node, offset: number): number {
  let total = 0;
  let found = false;

  function traverse(node: Node): void {
    if (node === target) {
      total += offset;
      found = true;
      return;
    }
    if (node.nodeType === Node.TEXT_NODE) {
      total += node.textContent?.length || 0;
    } else {
      node.childNodes.forEach(child => {
        if (!found) traverse(child);
      });
    }
  }
  
  traverse(container);
  return total;
}