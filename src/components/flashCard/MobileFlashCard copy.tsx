import React, { useState, useRef, useEffect } from 'react';
import { Box, Grid, Typography, ToggleButtonGroup, ToggleButton, AppBar, Toolbar, IconButton } from '@mui/material';
import { CardData } from '../../models/flashCardTypes';
import FlashCardItem from './FlashCardItem';
import FlashCardModal from './FlashCardModal';
import MobileEditCard from './MobileEditCard';
import FlashCardFloatingToolbar from './FlashCardFloatingToolbar';

// Importando os hooks individuais em vez do hook central
import useCardSelection from '../../hooks/flashCard/useCardSelection';
import useCardModals from '../../hooks/flashCard/useCardModals';
import useCardEditing from '../../hooks/flashCard/useCardEditing';
import useCardSplitting from '../../hooks/flashCard/useCardSplitting';
import useCardDelete from '../../hooks/flashCard/useCardDelete';

interface MobileFlashCardProps {
  initialCardData: string;
  ancestorsInfo: string;
  onSave: (cards: CardData[]) => void;
  onBack: () => void;
  title?: string;
}

type StudyMode = 'study' | 'edit' | 'create';

const MobileFlashCard: React.FC<MobileFlashCardProps> = ({
  initialCardData,
  ancestorsInfo,
  onSave,
  onBack,
  title = "FlashCards"
}) => {
  const [mode, setMode] = useState<StudyMode>('study');
  const [showFullScreenEdit, setShowFullScreenEdit] = useState<boolean>(false);
  
  // Estado dos cards - agora gerenciado diretamente aqui
  const [cards, setCards] = useState<CardData[]>([
    { plainText: initialCardData, originalText: initialCardData, answer: '' }
  ]);
  
  // Referências aos elementos de cada card
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Inicializa os hooks diretamente no componente
  const { captureSelection } = useCardSelection(cards, questionRefs);

  const { 
    modalOpen, modalInput, originalSelection, selRange, currentCardIndex, currentEditCardIndex,
    setCurrentCardIndex, setEditModalOpen, setCurrentEditCardIndex, handlePerguntarClickOneButton: handleModalOpen,
    handleCloseModal: hookCloseModal, resetSelectionStates
  } = useCardModals();

  // Função local para fechar o modal de edição fullscreen
  const handleCloseModal = () => {
    hookCloseModal();
    setShowFullScreenEdit(false);
  };
  
  const { handleEditCard: baseHandleEditCard, handleUpdateCard, handleAnswerChange } = useCardEditing(
    setCards, handleCloseModal, setEditModalOpen, currentCardIndex, 
    setCurrentCardIndex, currentEditCardIndex, setCurrentEditCardIndex, resetSelectionStates
  );
  
  const { handleDividirClick } = useCardSplitting(cards, setCards, captureSelection);
  
  const { handleDeleteCard } = useCardDelete(setCards, setEditModalOpen, setCurrentEditCardIndex);

  // Função local para abrir o modal de edição fullscreen
  const handleEditCard = (index: number) => {
    baseHandleEditCard(index);
    setShowFullScreenEdit(true);
  };

  // Wrapper para lidar com a seleção antes de abrir o modal de perguntas
  const handlePerguntarClick = (selection: Selection) => {
    const selectionData = captureSelection(selection);
    if (selectionData) {
      handleModalOpen(selectionData);
    }
  };

  // Wrapper para manipular a divisão de cards
  const handleDividir = (selection: Selection) => {
    handleDividirClick(selection);
  };

  // Efeito para atualização quando o initialCardData muda
  useEffect(() => {
    const newCards = [
      { plainText: initialCardData, originalText: initialCardData, answer: '' }
    ];
    setCards(newCards);
  }, [initialCardData]);
  
  // Efeito para salvar automaticamente quando os cards mudam
  useEffect(() => {
    onSave(cards);
  }, [cards, onSave]);

  // Função local para lidar com o fechamento do modal de edição
  const handleCloseEditModal = () => {
    setShowFullScreenEdit(false);
  };
  
  // Se estiver mostrando o editor full-screen
  if (showFullScreenEdit && currentEditCardIndex !== null) {
    return (
      <MobileEditCard
        defaultCard={cards[currentEditCardIndex]}
        onSubmit={handleUpdateCard}
        onDelete={() => handleDeleteCard(currentEditCardIndex)}
        onClose={handleCloseEditModal}
      />
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Barra superior com botão voltar */}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onBack}>
            <span style={{ fontSize: '24px' }}>←</span>
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ padding: 1, flex: 1, overflow: 'auto' }}>
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
              onEdit={() => handleEditCard(index)}
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

        {/* Mantemos o FlashCardModal como modal por ser mais simples */}
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
      </Box>
    </Box>
  );
};

export default MobileFlashCard;