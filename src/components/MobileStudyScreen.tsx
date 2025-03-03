import React, { useEffect, useState, useCallback } from 'react'; 
import { Box, Tabs, Tab } from '@mui/material';
import { parseCSV } from '../util/csvUtils';
import { Lei } from '../models/Lei';
import FlashCard from './flashCard/FlashCard';
import { FlashCardForm } from '../models/flashCardTypes';
import { getAncestors, mapRowToLei } from '../util/leiUtils';
import LeiList from './LeiList';

const MobileStudyScreen: React.FC = () => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [data, setData] = useState<Lei[]>([]);
  const [selectedLei, setSelectedLei] = useState<Lei | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [ancestorsInfo, setAncestorsInfo] = useState<string>("");
  const [defaultQuestion, setDefaultQuestion] = useState<string>("");

  const buildFlashCard = useCallback((lei: Lei, leis: Lei[]) => {
    const ancestors = getAncestors(lei, leis);
    const ancestorsStr = ancestors
      .map((a) => `${a.tipo.toUpperCase()} (${a.numero}): ${a.dispositivo}`)
      .join(' -> ');
    setAncestorsInfo(ancestorsStr || 'Nenhum pai');
    setDefaultQuestion(lei.dispositivo);
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
    // Switch to flashcard tab after selection
    setTabValue(1);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const onSubmit = (formData: FlashCardForm) => {
    console.log('Flash Card enviado:', formData);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh' }}>
      {/* Tabs Interface */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="study tabs" variant="fullWidth">
          <Tab label="Lista de Leis" />
          <Tab label="Flash Card" />
        </Tabs>
      </Box>
      
      {/* Content Area */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', padding: 2 }}>
        {tabValue === 0 ? (
          <LeiList 
            data={data} 
            onSelectionChange={handleSelectionChange} 
            selectedIndex={selectedIndex} 
          />
        ) : (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}>
            <FlashCard
              ancestorsInfo={ancestorsInfo}
              defaultQuestion={defaultQuestion}
              onSubmit={onSubmit}
              hideFeedback={true} // Hide feedback input on mobile
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MobileStudyScreen;