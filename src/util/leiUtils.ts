import { DeviceType } from "../models/DeviceType";
import { Lei } from "../models/Lei";

export const mapRowToLei = (row: string[]): Lei => ({
  lei: row[0] || "",
  dispositivo: row[1] || "",
  hierarquia: row[2] || "",
  tipo: row[3] as DeviceType,
  numero: row[4] || "",
  artigo: row[5] || "",
  paragrafo: row[6] || "",
  inciso: row[7] || "",
  aliena: row[8] || "",
  parte: row[9] || "",
  titulo: row[10] || "",
  capitulo: row[11] || "",
  secao: row[12] || "",
  subsecao: row[13] || "",
  ano: row[14] || "",
  ordem: parseInt(row[15], 10) || 0
});

export const findRecord = (leis: Lei[], tipo: DeviceType, numero: string): Lei | null => {
  return leis.find(l => l.tipo === tipo && l.numero.toLowerCase() === numero.toLowerCase()) || null;
};

export const getAncestors = (lei: Lei, leis: Lei[]): Lei[] => {
  const ancestors: Lei[] = [];
  if (lei.tipo === DeviceType.ARTIGO) return ancestors;

  const addArticle = () => {
    const article = findRecord(leis, DeviceType.ARTIGO, lei.artigo);
    if(article) ancestors.push(article);
  };

  if (lei.tipo === DeviceType.PARAGRAFO || lei.tipo === DeviceType.PARAGRAFO_UNICO) {
    addArticle();
  }

  if (lei.tipo === DeviceType.INCISO) {
    if (lei.paragrafo) {
      const paragraph = findRecord(leis, DeviceType.PARAGRAFO, lei.paragrafo) ||
                        findRecord(leis, DeviceType.PARAGRAFO_UNICO, lei.paragrafo);
      if (paragraph) ancestors.push(paragraph);
    }
    addArticle();
  }

  if (lei.tipo === DeviceType.ALINEA) {
    if (lei.inciso) {
      const inciso = findRecord(leis, DeviceType.INCISO, lei.inciso);
      if (inciso) {
        ancestors.push(inciso);
        if (inciso.paragrafo) {
          const paragraph = findRecord(leis, DeviceType.PARAGRAFO, inciso.paragrafo) ||
                            findRecord(leis, DeviceType.PARAGRAFO_UNICO, inciso.paragrafo);
          if (paragraph) ancestors.push(paragraph);
        }
      }
    } else if (lei.paragrafo) {
      const paragraph = findRecord(leis, DeviceType.PARAGRAFO, lei.paragrafo) ||
                        findRecord(leis, DeviceType.PARAGRAFO_UNICO, lei.paragrafo);
      if (paragraph) ancestors.push(paragraph);
    }
    addArticle();
  }
  
  return ancestors;
};