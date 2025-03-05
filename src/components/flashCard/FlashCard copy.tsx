import React, { useState, useRef, useEffect } from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { CardData, FlashCardForm } from '../../models/flashCardTypes';
import FlashCardItem from './FlashCardItem';
import FlashCardModal from './FlashCardModal';
import EditCardModal from './EditCardModal';
import FlashCardFloatingToolbar from './FlashCardFloatingToolbar';

// Importando os hooks refatorados
import useCardSelection from '../../hooks/flashCard/useCardSelection';
import useCardSplitting from '../../hooks/flashCard/useCardSplitting';
import useCardModals from '../../hooks/flashCard/useCardModals';
import useCardEditing from '../../hooks/flashCard/useCardEditing';
import useCardDelete from '../../hooks/flashCard/useCardDelete';

interface FlashCardProps {
  ancestorsInfo: string;
  defaultQuestion: string;
  onSubmit: (data: FlashCardForm) => void;
  hideFeedback?: boolean; // Added prop for mobile view
  mode?: 'study' | 'edit' | 'create'; // Added prop for controlling the mode
}

const FlashCard: React.FC<FlashCardProps> = ({ 
  ancestorsInfo, 
  defaultQuestion, 
  onSubmit,
  hideFeedback = false, // Default to showing feedback
  mode = 'study' // Default to study mode
}) => {
  // Inicializa os métodos do react-hook-form com os valores iniciais
  const methods = useForm<FlashCardForm>({
    defaultValues: {
      cards: [
        { plainText: defaultQuestion, originalText: defaultQuestion, answer: '' }
      ]
    }
  });
  const { handleSubmit, reset } = methods;

  // Estado dos cards
  const [cards, setCards] = useState<CardData[]>([
    { plainText: defaultQuestion, originalText: defaultQuestion, answer: '' }
  ]);
  
  // Referências aos elementos de cada card
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Aplicando os hooks refatorados
  const { captureSelection } = useCardSelection(cards, questionRefs);
  
  const { 
    modalOpen, 
    modalInput, 
    originalSelection,
    selRange,
    currentCardIndex,
    editModalOpen,
    currentEditCardIndex,    
    setCurrentCardIndex,
    setEditModalOpen,
    setCurrentEditCardIndex,
    handlePerguntarClickOneButton: handleModalOpen,
    handleCloseModal,
    resetSelectionStates
  } = useCardModals();
  
  const { handleEditCard, handleUpdateCard, handleAnswerChange } = useCardEditing(
    setCards,
    handleCloseModal,
    setEditModalOpen,
    currentCardIndex,
    setCurrentCardIndex,
    currentEditCardIndex,
    setCurrentEditCardIndex,
    resetSelectionStates
  );
  
  const { handleDividirClick: dividirHandler } = useCardSplitting(
    cards,
    setCards,
    captureSelection
  );
  
  const { handleDeleteCard } = useCardDelete(
    setCards,
    setEditModalOpen,
    setCurrentEditCardIndex
  );

  // Wrapper para lidar com a seleção antes de abrir o modal de perguntas
  const handlePerguntarClickOneButton = (selection: Selection) => {
    const selectionData = captureSelection(selection);
    handleModalOpen(selectionData);
  };

  // Wrapper para garantir que a função de dividir tenha acesso à seleção atual
  const handleDividirClick = (selection: Selection) => {
    dividirHandler(selection);
  };

  // Efeitos para sincronizar o estado dos cards com o formulário
  useEffect(() => {
    reset({ cards });
  }, [cards, reset]);

  useEffect(() => {
    const newCards = [
      { plainText: defaultQuestion, originalText: defaultQuestion, answer: '' }
    ];
    setCards(newCards);
    reset({ cards: newCards });
  }, [defaultQuestion, reset]);

  return (
    <FormProvider {...methods}>
      <Box
        sx={{
          borderRadius: 2,
          boxShadow: 1,
          padding: 2,
          backgroundColor: 'background.paper',
          width: '90%',
          margin: '20px auto'
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Exibir os botões apenas em determinados modos */}
          {(mode === 'edit' || mode === 'create') && (
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
              <Grid item>
                <Button
                  onClick={() => handlePerguntarClickOneButton(window.getSelection()!)}
                  variant="outlined"
                >
                  Perguntar
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => handleDividirClick(window.getSelection()!)}
                  variant="outlined"
                  color="error"
                >
                  Dividir
                </Button>
              </Grid>
            </Grid>
          )}

          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
            {ancestorsInfo}
          </Typography>

          <Grid container spacing={2}>
            {cards.map((card, index) => (
              <FlashCardItem
                key={index}
                card={card}
                index={index}
                questionRefs={questionRefs}
                onEdit={handleEditCard}
                onAnswerChange={handleAnswerChange}
                hideFeedback={hideFeedback}
                mode={mode} // Passamos o modo para os FlashCardItems
              />
            ))}
          </Grid>

          {/* Mostrar botão de envio apenas se não estiver no modo hideFeedback */}
          {!hideFeedback && (
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
                  Enviar Flash Card
                </Button>
              </Grid>
            </Grid>
          )}
        </form>
      </Box>

      {/* Exibir a barra flutuante apenas no modo criação */}
      {mode === 'create' && (
        <FlashCardFloatingToolbar
          onPerguntar={handlePerguntarClickOneButton}
          onDividir={handleDividirClick}
        />
      )}

      {/* Modais */}
      {currentCardIndex !== null && (
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
          onClose={() => setEditModalOpen(false)}
          defaultCard={cards[currentEditCardIndex]}
          onSubmit={handleUpdateCard}
          onDelete={() => handleDeleteCard(currentEditCardIndex)}
        />
      )}
    </FormProvider>
  );
};

export default FlashCard;