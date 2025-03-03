import React, { useEffect, useState, useCallback } from 'react'; 
import { Box } from '@mui/material';
import { parseCSV } from '../util/csvUtils';
import { Lei } from '../models/Lei';
import { CardData } from '../models/flashCardTypes';
import { getAncestors, mapRowToLei } from '../util/leiUtils';
import LeiList from './LeiList';
import MobileFlashCard from './flashCard/MobileFlashCard';

const MobileStudyScreen: React.FC = () => {
  const [showLeiList, setShowLeiList] = useState<boolean>(true);
  const [data, setData] = useState<Lei[]>([]);
  const [selectedLei, setSelectedLei] = useState<Lei | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [ancestorsInfo, setAncestorsInfo] = useState<string>("");
  const [cards, setCards] = useState<CardData[]>([]);

  const buildFlashCard = useCallback((lei: Lei, leis: Lei[]) => {
    const ancestors = getAncestors(lei, leis);
    const ancestorsStr = ancestors
      .map((a) => `${a.tipo.toUpperCase()} (${a.numero}): ${a.dispositivo}`)
      .join(' -> ');
    setAncestorsInfo(ancestorsStr || 'Nenhum pai');
    
    // Criar um novo card baseado na lei selecionada
    const newCard: CardData = {
      plainText: lei.dispositivo,
      originalText: lei.dispositivo,
      answer: ''
    };
    
    setCards([newCard]);
  }, []);

  useEffect(() => {
    fetch('/cf_csv.csv')
      .then(response => response.text())
      .then(text => {
        const rows = parseCSV(text, 1000);
        const dataRows = rows.slice(1);
        const leis = dataRows.map(mapRowToLei);
        setData(leis);
        if (leis.length > 0) {
          setSelectedLei(leis[0]);
          setSelectedIndex(0);
          buildFlashCard(leis[0], leis);
        }
      });
  }, [buildFlashCard]);

  const handleSelectionChange = (index: number) => {
    const lei = data[index];
    setSelectedLei(lei);
    setSelectedIndex(index);
    buildFlashCard(lei, data);
    setShowLeiList(false); // Mostrar os flashcards após selecionar uma lei
  };

  const handleCardUpdate = (index: number, updatedCard: CardData) => {
    const newCards = [...cards];
    newCards[index] = updatedCard;
    setCards(newCards);
  };

  const handleCardDelete = (index: number) => {
    const newCards = cards.filter((_, i) => i !== index);
    setCards(newCards);
  };

  const handleBackToList = () => {
    setShowLeiList(true);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
      height: '100vh', 
      overflow: 'hidden' 
    }}>
      {showLeiList ? (
        <LeiList 
          data={data} 
          onSelectionChange={handleSelectionChange} 
          selectedIndex={selectedIndex} 
        />
      ) : (
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          <Box 
            onClick={handleBackToList} 
            sx={{ 
              padding: '8px 16px', 
              color: 'primary.main', 
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            ← Voltar para lista
          </Box>
          <MobileFlashCard 
            cards={cards}
            ancestorsInfo={ancestorsInfo}
            onCardUpdate={handleCardUpdate}
            onCardDelete={handleCardDelete}
          />
        </Box>
      )}
    </Box>
  );
};

export default MobileStudyScreen;