import { DeviceType } from "./DeviceType";

export interface Lei {
  // Identificação da Lei
  lei: string; // Ex: "Código Penal", "Constituição Federal"
  ano: string; // Ano da publicação da Lei
  ordem: number; // Ordem do dispositivo na lei

  // Identificação do Dispositivo
  hierarquia: string; // Número da hierarquia do dispositivo (ex: "1", "2.3", "IV.1")
  //tipo: string; // Tipo do dispositivo (ex: "Artigo", "Parágrafo", "Inciso")
  tipo: DeviceType | string;
  numero: string; // Número do dispositivo (ex: "5", "2º", "III", "a")

  // Conteúdo do Dispositivo
  dispositivo: string; // Texto completo do artigo, parágrafo, inciso, etc.

  // Estrutura do Dispositivo Legal
  artigo: string;
  paragrafo: string;
  inciso: string;
  aliena: string;

  // Estrutura Hierárquica da Lei
  parte: string;
  titulo: string;
  capitulo: string;
  secao: string;
  subsecao: string;
}
