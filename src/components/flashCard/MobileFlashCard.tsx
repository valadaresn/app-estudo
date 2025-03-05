import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { CardData } from '../../models/flashCardTypes';
import FlashCardItem from './FlashCardItem';
import FlashCardModal from './FlashCardModal';
import EditCardModal from './EditCardModal';
import FlashCardFloatingToolbar from './FlashCardFloatingToolbar';

// Importando o hook central
import useFlashCards from '../../hooks/flashCard/useFlashCard';

interface MobileFlashCardProps {
  initialCardData: string; // Recebe apenas o texto inicial, não os cards completos
  ancestorsInfo: string;
  onSave: (cards: CardData[]) => void; // Callback para salvar alterações
}

type StudyMode = 'study' | 'edit' | 'create';

const MobileFlashCard: React.FC<MobileFlashCardProps> = ({
  initialCardData,
  ancestorsInfo,
  onSave
}) => {
  const [mode, setMode] = useState<StudyMode>('study');
  
  // Usa o hook central para gerenciar toda a lógica
  const {
    cards,
    questionRefs,
    modalOpen,
    modalInput,
    originalSelection,
    selRange,
    currentCardIndex,
    editModalOpen,
    currentEditCardIndex,
    handlePerguntarClick,
    handleDividir,
    handleEditCard,
    handleUpdateCard,
    handleAnswerChange,
    handleDeleteCard,
    handleCloseModal
  } = useFlashCards({ defaultQuestion: initialCardData });
  
  // Efeito para salvar automaticamente quando os cards mudam
  useEffect(() => {
    // Salvamos automaticamente quando houver mudanças
    onSave(cards);
  }, [cards, onSave]);

  return (
    <Box sx={{ width: '100%', padding: 1 }}>
      <Box sx={{ marginBottom: 2 }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, newMode) => newMode && setMode(newMode)}
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

      {ancestorsInfo && (
        <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
          {ancestorsInfo}
        </Typography>
      )}

      <Grid container spacing={2}>
        {cards.map((card, index) => (
          <FlashCardItem
            key={index}
            card={card}
            index={index}
            questionRefs={questionRefs}
            onEdit={handleEditCard}
            onAnswerChange={handleAnswerChange}
            hideFeedback={true} 
            mode={mode}
          />
        ))}
      </Grid>

      {/* Exibir a barra flutuante apenas no modo criação */}
      {mode === 'create' && (
        <FlashCardFloatingToolbar 
          onPerguntar={handlePerguntarClick}
          onDividir={handleDividir}
        />
      )}

      {/* Modais */}
      {currentCardIndex !== null && modalOpen && (
        <FlashCardModal
          open={modalOpen}
          onClose={handleCloseModal}
          defaultCard={cards[currentCardIndex]}
          defaultInput={modalInput}
          onSubmit={handleUpdateCard}
          selRange={selRange}
          originalSelection={originalSelection}
        />
      )}
      
      {currentEditCardIndex !== null && (
        <EditCardModal
          open={editModalOpen}
          onClose={handleCloseModal}
          defaultCard={cards[currentEditCardIndex]}
          onSubmit={handleUpdateCard}
          onDelete={() => handleDeleteCard(currentEditCardIndex)}
        />
      )}
    </Box>
  );
};

export default MobileFlashCard;