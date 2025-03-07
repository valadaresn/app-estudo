import React, { useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { parseCSV } from '../util/csvUtils';
import { Lei } from '../models/Lei';
import { CardData } from '../models/flashCardTypes';
import { mapRowToLei, getAncestors } from '../util/leiUtils';
import LeiList from './LeiList';
import MobileFlashCard from './flashCard/MobileFlashCard';

const MobileStudyScreen: React.FC = () => {
  const [showLeiList, setShowLeiList] = useState<boolean>(true);
  const [data, setData] = useState<Lei[]>([]);
  const [selectedLei, setSelectedLei] = useState<Lei | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [ancestorsInfo, setAncestorsInfo] = useState<string>("");
  const [savedCards, setSavedCards] = useState<{ [key: string]: CardData[] }>({});

  const buildAncestorsInfo = useCallback((lei: Lei, leis: Lei[]) => {
    const ancestors = getAncestors(lei, leis);
    const ancestorsStr = ancestors
      .map((a) => `${a.tipo.toUpperCase()} (${a.numero}): ${a.dispositivo}`)
      .join(' -> ');
    setAncestorsInfo(ancestorsStr || 'Nenhum pai');
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
          buildAncestorsInfo(leis[0], leis);
        }
      });
  }, [buildAncestorsInfo]);

  const handleSelectionChange = (index: number) => {
    const lei = data[index];
    setSelectedLei(lei);
    setSelectedIndex(index);
    buildAncestorsInfo(lei, data);
  };

  // Novo manipulador para salvar as alterações dos cards
  const handleSaveCards = (cards: CardData[]) => {
    if (selectedLei) {
      // Usamos o id da lei como chave para armazenar os cards
      const leiKey = `${selectedLei.tipo}-${selectedLei.numero}`;
      setSavedCards(prev => ({
        ...prev,
        [leiKey]: cards
      }));
    }
  };

  const handleBackToList = () => {
    setShowLeiList(true);
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', overflow: 'auto' }}>
      {showLeiList ? (
        <LeiList
          data={data}
          onSelectionChange={(idx) => {
            handleSelectionChange(idx);
            setShowLeiList(false);
          }}
          selectedIndex={selectedIndex}         
        />
      ) : (
        <>
          {selectedLei && (
            <MobileFlashCard
              initialCardData={selectedLei.dispositivo}
              ancestorsInfo={ancestorsInfo}
              onSave={handleSaveCards}
              onBack={handleBackToList}
              title={selectedLei?.dispositivo?.substring(0, 30) + "..."}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default MobileStudyScreen;