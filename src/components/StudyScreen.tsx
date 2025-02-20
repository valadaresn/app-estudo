import React, { useEffect, useState, useCallback } from 'react'; 
import { Drawer, Box } from '@mui/material';
import { parseCSV } from '../util/csvUtils';
import { Lei } from '../models/Lei';
import FlashCard, { FlashCardForm } from './FlashCard';
import { getAncestors, mapRowToLei } from '../util/leiUtils';
import LeiList from './LeiList';

const drawerWidth = 400;

const StudyScreen: React.FC = () => {
  const [data, setData] = useState<Lei[]>([]);
  const [selectedLei, setSelectedLei] = useState<Lei | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0); // Adiciona o estado selectedIndex
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
          setSelectedIndex(0); // Define o índice selecionado inicial
          buildFlashCard(leis[0], leis);
        }
      });
  }, [buildFlashCard]);

  const handleSelectionChange = (index: number) => {
    const lei = data[index];
    setSelectedLei(lei);
    setSelectedIndex(index); // Atualiza o índice selecionado
    buildFlashCard(lei, data);
  };

  const onSubmit = (formData: FlashCardForm) => {
    console.log('Flash Card enviado:', formData);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Drawer fixo na esquerda */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box>
          <LeiList data={data} onSelectionChange={handleSelectionChange} selectedIndex={selectedIndex} />
        </Box>
      </Drawer>

      {/* Área principal: ocupando todo o espaço restante */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,          
          display: 'flex',
          justifyContent: 'center', // Centraliza horizontalmente
          alignItems: 'center', // Alinha no início verticalmente          
          //padding: 2, // Espaço interno para não ficar colado na borda
          marginTop: 20, // Dá um espaçamento do Drawer
        }}
      >
        <FlashCard
          ancestorsInfo={ancestorsInfo}
          defaultQuestion={defaultQuestion}
          onSubmit={onSubmit}
        />
      </Box>
    </Box>
  );
};

export default StudyScreen;