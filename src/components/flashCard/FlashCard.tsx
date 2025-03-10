import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
  Typography,  
  Button,
  Grid,
  Box,
} from '@mui/material';
import { FlashCardForm } from '../../models/flashCardTypes';
import FlashCardItem from './FlashCardItem';
import FlashCardModal from './FlashCardModal';
import EditCardModal from './EditCardModal';
import FlashCardFloatingToolbar from './FlashCardFloatingToolbar';
import useFlashCards from '../../hooks/flashCard/useFlashCard';

// Importando o hook central
//import useFlashCards from '../../hooks/flashCard/useFlashCards';

interface FlashCardProps {
  ancestorsInfo: string;
  defaultQuestion: string;
  onSubmit: (data: FlashCardForm) => void;
  hideFeedback?: boolean;
  mode?: 'study' | 'edit' | 'create';
}

const FlashCard: React.FC<FlashCardProps> = ({ 
  ancestorsInfo, 
  defaultQuestion, 
  onSubmit,
  hideFeedback = false,
  mode = 'study'
}) => {
  // Inicializa o formulário
  const methods = useForm<FlashCardForm>({
    defaultValues: {
      cards: [
        { plainText: defaultQuestion, originalText: defaultQuestion, answer: '' }
      ]
    }
  });
  const { handleSubmit, reset } = methods;

  // Usa o hook central que gerencia toda a lógica
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
  } = useFlashCards({ defaultQuestion, reset });

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
                  onClick={() => handlePerguntarClick(window.getSelection()!)}
                  variant="outlined"
                >
                  Perguntar
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => handleDividir(window.getSelection()!)}
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
                mode={mode}
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
          onPerguntar={handlePerguntarClick}
          onDividir={handleDividir}
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
          onClose={() => handleCloseModal()}
          defaultCard={cards[currentEditCardIndex]}
          onSubmit={handleUpdateCard}
          onDelete={() => handleDeleteCard(currentEditCardIndex)}
        />
      )}
    </FormProvider>
  );
};

export default FlashCard;