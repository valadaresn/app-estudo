import Papa from 'papaparse';

export function parseCSV(text: string, limit = 500): string[][] {
  const result = Papa.parse(text, {
    delimiter: ";",
    skipEmptyLines: true,
  });

  // Limita as linhas se necessário
  return result.data.slice(0, limit) as string[][];
}