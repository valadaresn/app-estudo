import React, { useEffect, useState, useCallback } from 'react'; 
import { Drawer, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { parseCSV } from '../util/csvUtils';
import { Lei } from '../models/Lei';
import FlashCard from './flashCard/FlashCard'; // Atualizado o caminho do FlashCard
import { FlashCardForm } from '../models/flashCardTypes'; // Importa FlashCardForm do arquivo de tipos
import { getAncestors, mapRowToLei } from '../util/leiUtils';
import LeiList from './LeiList';

const drawerWidth = 400;

// Definindo o tipo StudyMode
type StudyMode = 'study' | 'edit' | 'create';

const StudyScreen: React.FC = () => {
  const [data, setData] = useState<Lei[]>([]);
  const [selectedLei, setSelectedLei] = useState<Lei | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0); // Adiciona o estado selectedIndex
  const [ancestorsInfo, setAncestorsInfo] = useState<string>("");
  const [defaultQuestion, setDefaultQuestion] = useState<string>("");
  const [mode, setMode] = useState<StudyMode>('study'); // Estado para controlar o modo

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

  // Handler para mudança de modo
  const handleModeChange = (_: React.MouseEvent<HTMLElement>, newMode: StudyMode | null) => {
    if (newMode) {
      setMode(newMode);
    }
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
          flexDirection: 'column',
          alignItems: 'center',         
          padding: 2,
          marginTop: 2,
        }}
      >
        {/* Adicionamos os botões toggle para selecionar o modo */}
        <Box sx={{ width: '90%', marginBottom: 2 }}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            aria-label="Modo de estudo"
            fullWidth
            size="small"
          >
            <ToggleButton value="study" aria-label="modo estudo">
              Estudo
            </ToggleButton>
            <ToggleButton value="edit" aria-label="modo edição">
              Edição
            </ToggleButton>
            <ToggleButton value="create" aria-label="modo criação">
              Criação
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        <FlashCard
          ancestorsInfo={ancestorsInfo}
          defaultQuestion={defaultQuestion}
          onSubmit={onSubmit}
          hideFeedback={false}
          mode={mode} // Passamos o modo selecionado para o FlashCard
        />
      </Box>
    </Box>
  );
};

export default StudyScreen;