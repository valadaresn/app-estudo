import React, { useRef, useState, useEffect } from 'react';
import { Box, Grid, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { CardData } from '../../models/flashCardTypes';
import FlashCardItem from './FlashCardItem';
import EditCardModal from './EditCardModal';
import FlashCardFloatingToolbar from './FlashCardFloatingToolbar';
import FlashCardModal from './FlashCardModal';

// Importando os hooks existentes
import useCardSelection from '../../hooks/flashCard/useCardSelection';
import useCardSplitting from '../../hooks/flashCard/useCardSplitting';
import useCardModals from '../../hooks/flashCard/useCardModals';

interface MobileFlashCardProps {
  cards: CardData[];
  ancestorsInfo: string;
  onCardUpdate: (index: number, updatedCard: CardData) => void;
  onCardDelete: (index: number) => void;
}

type StudyMode = 'study' | 'edit' | 'create';

const MobileFlashCard: React.FC<MobileFlashCardProps> = ({
  cards,
  ancestorsInfo,
  onCardUpdate,
  onCardDelete
}) => {
  const [mode, setMode] = useState<StudyMode>('study');
  const [editCardIndex, setEditCardIndex] = useState<number | null>(null);
  const [localCards, setLocalCards] = useState<CardData[]>(cards);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Atualizando localCards quando cards externos mudam
  useEffect(() => {
    setLocalCards(cards);
  }, [cards]);

  // Hooks para gerenciar modais e seleção de texto
  const { captureSelection } = useCardSelection(localCards, questionRefs);
  
  const { 
    modalOpen, 
    modalInput, 
    originalSelection,
    selRange,
    currentCardIndex,
    handlePerguntarClickOneButton,
    handleCloseModal
  } = useCardModals();

  // Utilizando o hook com o setState local
  const { handleDividirClick } = useCardSplitting(
    localCards,
    setLocalCards,
    captureSelection
  );

  // Sincronizar alterações locais para o componente pai
  useEffect(() => {
    localCards.forEach((card, idx) => {
      if (idx < cards.length) {
        onCardUpdate(idx, card);
      } else if (idx === cards.length) {
        // Este é um novo card que foi adicionado (como resultado da divisão)
        onCardUpdate(idx, card);
      }
    });
  }, [localCards, cards.length, onCardUpdate]);

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMode(event.target.value as StudyMode);
  };

  const handleEditCard = (index: number) => {
    setEditCardIndex(index);
  };

  const handleCardUpdate = (updatedCard: CardData) => {
    if (editCardIndex !== null) {
      onCardUpdate(editCardIndex, updatedCard);
      setEditCardIndex(null);
    }
  };

  const handleAnswerChange = (index: number, answer: string) => {
    const updatedCard = { ...localCards[index], answer };
    
    // Atualize o estado local primeiro
    setLocalCards(prev => {
      const updated = [...prev];
      updated[index] = updatedCard;
      return updated;
    });
    
    // Também notifique o componente pai
    onCardUpdate(index, updatedCard);
  };

  // Wrapper para lidar com a seleção antes de abrir o modal de perguntas
  const handlePerguntar = (selection: Selection) => {
    const selectionData = captureSelection(selection);
    if (selectionData) {
      handlePerguntarClickOneButton(selectionData);
    }
  };

  // Wrapper para a função de dividir cartão - CORRIGIDO
  const handleDividir = (selection: Selection) => {
    // Usamos diretamente o handleDividirClick do hook
    handleDividirClick(selection);
  };

  // Manipulador para submissão do modal de perguntas
  const handleModalSubmit = (updatedCard: CardData) => {
    if (currentCardIndex !== null) {
      // Atualize o estado local primeiro
      setLocalCards(prev => {
        const updated = [...prev];
        updated[currentCardIndex] = updatedCard;
        return updated;
      });
      
      // Também notifique o componente pai
      onCardUpdate(currentCardIndex, updatedCard);
      handleCloseModal();
    }
  };

  return (
    <Box sx={{ width: '100%', padding: 1 }}>
      {/* Controles de modo */}
      <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
        <RadioGroup
          row
          value={mode}
          onChange={handleModeChange}
          sx={{ justifyContent: 'center' }}
        >
          <FormControlLabel value="study" control={<Radio />} label="Estudar" />
          <FormControlLabel value="edit" control={<Radio />} label="Editar" />
          <FormControlLabel value="create" control={<Radio />} label="Criar" />
        </RadioGroup>
      </FormControl>

      {/* Informações de contexto */}
      {ancestorsInfo && (
        <Typography 
          variant="body2" 
          color="textSecondary" 
          sx={{ mb: 2, fontSize: '0.75rem' }}
        >
          {ancestorsInfo}
        </Typography>
      )}

      {/* Lista de cartões */}
      <Grid container spacing={1}>
        {localCards.map((card, index) => (
          <Grid item xs={12} key={index}>
            <FlashCardItem
              card={card}
              index={index}
              questionRefs={questionRefs}
              onEdit={handleEditCard}
              onAnswerChange={handleAnswerChange}
              hideFeedback={true}
              mode={mode}
            />
          </Grid>
        ))}
      </Grid>

      {/* Modal de edição */}
      {editCardIndex !== null && (
        <EditCardModal
          open={editCardIndex !== null}
          onClose={() => setEditCardIndex(null)}
          defaultCard={localCards[editCardIndex]}
          onSubmit={handleCardUpdate}
          onDelete={() => onCardDelete(editCardIndex)}
        />
      )}

      {/* Barra de ferramentas flutuante para o modo de criação */}
      {mode === 'create' && (
        <FlashCardFloatingToolbar 
          onPerguntar={handlePerguntar}
          onDividir={handleDividir}
        />
      )}

      {/* Modal de criação de pergunta */}
      {currentCardIndex !== null && modalOpen && (
        <FlashCardModal
          open={modalOpen}
          onClose={handleCloseModal}
          defaultCard={localCards[currentCardIndex]}
          defaultInput={modalInput}
          onSubmit={handleModalSubmit}
          selRange={selRange}
          originalSelection={originalSelection}
        />
      )}
    </Box>
  );
};

export default MobileFlashCard;