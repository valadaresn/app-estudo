import React, { useEffect, useState } from 'react';
import { DeviceType } from '../models/DeviceType';
import { Lei } from '../models/Lei';

const sampleData: Lei[] = [
  { lei: "cf", dispositivo: "TÍTULO I: Dos Princípios Fundamentais", hierarquia: "8", tipo: DeviceType.TITULO, numero: "I", artigo: "", paragrafo: "", inciso: "", aliena: "", ano: "1988", parte: "", titulo: "I", capitulo: "", secao: "", subsecao: "" },
  { lei: "cf", dispositivo: "Art. 1º A República Federativa do Brasil...", hierarquia: "4", tipo: DeviceType.ARTIGO, numero: "1", artigo: "1", paragrafo: "", inciso: "", aliena: "", ano: "1988", parte: "", titulo: "I", capitulo: "", secao: "", subsecao: "" },
  { lei: "cf", dispositivo: "I - a soberania;", hierarquia: "2", tipo: DeviceType.INCISO, numero: "I", artigo: "1", paragrafo: "", inciso: "I", aliena: "", ano: "1988", parte: "", titulo: "I", capitulo: "", secao: "", subsecao: "" },
  { lei: "cf", dispositivo: "II - a cidadania;", hierarquia: "2", tipo: DeviceType.INCISO, numero: "II", artigo: "1", paragrafo: "", inciso: "II", aliena: "", ano: "1988", parte: "", titulo: "I", capitulo: "", secao: "", subsecao: "" },
  { lei: "cf", dispositivo: "Parágrafo único. Todo o poder emana do povo...", hierarquia: "3", tipo: DeviceType.PARAGRAFO_UNICO, numero: "pu", artigo: "1", paragrafo: "único", inciso: "", aliena: "", ano: "1988", parte: "", titulo: "I", capitulo: "", secao: "", subsecao: "" },
  { lei: "cf", dispositivo: "Art. 2º São Poderes da União...", hierarquia: "4", tipo: DeviceType.ARTIGO, numero: "2", artigo: "2", paragrafo: "", inciso: "", aliena: "", ano: "1988", parte: "", titulo: "I", capitulo: "", secao: "", subsecao: "" },
  { lei: "cf", dispositivo: "I - construir uma sociedade livre...", hierarquia: "2", tipo: DeviceType.INCISO, numero: "I", artigo: "3", paragrafo: "", inciso: "I", aliena: "", ano: "1988", parte: "", titulo: "I", capitulo: "", secao: "", subsecao: "" },
  { lei: "cf", dispositivo: "II - garantir o desenvolvimento nacional;", hierarquia: "2", tipo: DeviceType.INCISO, numero: "II", artigo: "3", paragrafo: "", inciso: "II", aliena: "", ano: "1988", parte: "", titulo: "I", capitulo: "", secao: "", subsecao: "" },
  { lei: "cf", dispositivo: "Parágrafo único. A República Federativa ... integração econômica...", hierarquia: "3", tipo: DeviceType.PARAGRAFO_UNICO, numero: "pu", artigo: "4", paragrafo: "único", inciso: "", aliena: "", ano: "1988", parte: "", titulo: "I", capitulo: "", secao: "", subsecao: "" },
  // Outros registros se necessário
];

const findRecord = (tipo: DeviceType, numero: string): Lei | null => {
  return sampleData.find(l => l.tipo === tipo && l.numero.toLowerCase() === numero.toLowerCase()) || null;
};

const getAncestors = (lei: Lei): Lei[] => {
  const ancestors: Lei[] = [];

  if (lei.tipo === DeviceType.ARTIGO) return ancestors;

  const addArticle = () => {
    const article = findRecord(DeviceType.ARTIGO, lei.artigo);
    if(article) ancestors.push(article);
  };

  if (lei.tipo === DeviceType.PARAGRAFO || lei.tipo === DeviceType.PARAGRAFO_UNICO) {
    addArticle();
  }

  if (lei.tipo === DeviceType.INCISO) {
    if (lei.paragrafo) {
      const paragraph = findRecord(DeviceType.PARAGRAFO, lei.paragrafo) ||
                        findRecord(DeviceType.PARAGRAFO_UNICO, lei.paragrafo);
      if (paragraph) ancestors.push(paragraph);
    }
    addArticle();
  }

  if (lei.tipo === DeviceType.ALINEA) {
    if (lei.inciso) {
      const inciso = findRecord(DeviceType.INCISO, lei.inciso);
      if (inciso) {
        ancestors.push(inciso);
        if (inciso.paragrafo) {
          const paragraph = findRecord(DeviceType.PARAGRAFO, inciso.paragrafo) ||
                          findRecord(DeviceType.PARAGRAFO_UNICO, inciso.paragrafo);
          if (paragraph) ancestors.push(paragraph);
        }
      }
    } else if (lei.paragrafo) {
      const paragraph = findRecord(DeviceType.PARAGRAFO, lei.paragrafo) ||
                        findRecord(DeviceType.PARAGRAFO_UNICO, lei.paragrafo);
      if (paragraph) ancestors.push(paragraph);
    }
    addArticle();
  }
  
  return ancestors;
};

const StudyScreen: React.FC = () => {
  const [selectedLei, setSelectedLei] = useState<Lei | null>(null);
  const [flashCard, setFlashCard] = useState<{ question: string; answer: string; ancestorsInfo: string }>({
    question: "",
    answer: "",
    ancestorsInfo: ""
  });

  const buildFlashCard = (lei: Lei) => {
    const ancestors = getAncestors(lei);
    const ancestorsInfo = ancestors
      .map(a => `${a.tipo.toUpperCase()} (${a.numero}): ${a.dispositivo}`)
      .join(" -> ");
    setFlashCard({
      question: lei.dispositivo,
      answer: "",
      ancestorsInfo: ancestorsInfo || "Nenhum pai"
    });
  };

  useEffect(() => {
    if (sampleData.length > 0) {
      setSelectedLei(sampleData[0]);
      buildFlashCard(sampleData[0]);
    }
  }, []);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = Number(e.target.value);
    const lei = sampleData[selectedIndex];
    setSelectedLei(lei);
    buildFlashCard(lei);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFlashCard(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Tela de Estudos - Dispositivos da Lei</h2>
      <div>
        <label>Selecione o dispositivo:</label>
        <select onChange={handleSelectionChange}>
          {sampleData.map((lei, index) => (
            <option key={index} value={index}>
              {lei.tipo.toUpperCase()} - {lei.numero}
            </option>
          ))}
        </select>
      </div>
      {selectedLei && (
        <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
          Dispositivo selecionado: {selectedLei.dispositivo}
        </p>
      )}
      <div style={{ marginTop: "2rem", border: "1px solid #ccc", padding: "1rem" }}>
        <h3>Flash Card</h3>
        <div>
          <label>Pergunta:</label>
          <input
            type="text"
            name="question"
            value={flashCard.question}
            onChange={handleInputChange}
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label>Resposta:</label>
          <input
            type="text"
            name="answer"
            value={flashCard.answer}
            onChange={handleInputChange}
          />
        </div>
        <p style={{ marginTop: "1rem" }}><strong>Ancestors:</strong> {flashCard.ancestorsInfo}</p>
      </div>
    </div>
  );
};

export default StudyScreen;