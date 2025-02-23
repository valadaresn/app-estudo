import React, { useState, useRef, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Box, Grid, Typography, Button } from '@mui/material';
import { FlashCardForm, CardData } from '../../models/flashCardTypes';
import FlashCardItem from './FlashCardItem';
import FlashCardModal from './FlashCardModal';
import EditCardModal from './EditCardModal';
import useFlashCardActions from '../../hooks/useFlashCardActions';
import FlashCardFloatingToolbar from './FlashCardFloatingToolbar';

interface FlashCardProps {
  ancestorsInfo: string;
  defaultQuestion: string;
  onSubmit: (data: FlashCardForm) => void;
}

const FlashCard: React.FC<FlashCardProps> = ({ ancestorsInfo, defaultQuestion, onSubmit }) => {
  const methods = useForm<FlashCardForm>({
    defaultValues: { cards: [{ plainText: defaultQuestion, annotations: [], answer: '' }] }
  });
  const { handleSubmit, reset } = methods;

  const [cards, setCards] = useState<CardData[]>([
    { plainText: defaultQuestion, annotations: [], answer: '' }
  ]);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    reset({ cards });
  }, [cards, reset]);

  useEffect(() => {
    const newCards = [{ plainText: defaultQuestion, annotations: [], answer: '' }];
    setCards(newCards);
    reset({ cards: newCards });
  }, [defaultQuestion, reset]);

  const {
    modalOpen,
    setModalOpen, // Função de fechamento (handleCloseModal) sem argumentos
    modalInput,
    currentCardIndex,
    setCurrentCardIndex,
    handlePerguntarClickOneButton,
    handleDividirClick,
    selRange,
    originalSelection,
    handleAnswerChange
  } = useFlashCardActions(cards, setCards, questionRefs);

  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [currentEditCardIndex, setCurrentEditCardIndex] = useState<number | null>(null);

  const handleEditCard = (index: number) => {
    setCurrentEditCardIndex(index);
    setEditModalOpen(true);
  };

  const handleUpdateCard = (updatedCard: CardData) => {
    if (currentEditCardIndex === null) return;
    const newCards = [...cards];
    newCards[currentEditCardIndex] = updatedCard;
    setCards(newCards);
    setEditModalOpen(false);
    setCurrentEditCardIndex(null);
  };

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
          <Grid container spacing={2} sx={{ marginBottom: 2 }}>
            <Grid item>
              <Button onClick={() => handlePerguntarClickOneButton(window.getSelection()!)} variant="outlined">
                Perguntar
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={() => handleDividirClick(window.getSelection()!)} variant="outlined" color="error">
                Dividir
              </Button>
            </Grid>
          </Grid>

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
              />
            ))}
          </Grid>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
                Enviar Flash Card
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>

      <FlashCardFloatingToolbar
        onPerguntar={handlePerguntarClickOneButton}
        onDividir={handleDividirClick}
      />

      {currentCardIndex !== null && (
        <FlashCardModal
          open={modalOpen}
          onClose={setModalOpen} // setModalOpen aqui já é uma função sem parâmetros
          defaultCard={cards[currentCardIndex]}
          defaultInput={modalInput}
          onSubmit={(updatedCard: CardData) => {
            setCards((prevCards) => {
              const newCards = [...prevCards];
              newCards[currentCardIndex] = updatedCard;
              return newCards;
            });
            setModalOpen(); // Chama o fechamento sem argumentos
            setCurrentCardIndex(null);
          }}
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
        />
      )}
    </FormProvider>
  );
};

export default FlashCard;