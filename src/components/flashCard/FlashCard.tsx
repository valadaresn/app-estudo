import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Grid, Typography, Button } from '@mui/material';
import { FlashCardForm, CardData } from '../../models/flashCardTypes';
import FlashCardItem from './FlashCardItem';
import FlashCardModal from './FlashCardModal';
import useFlashCardActions from '../../hooks/useFlashCardActions';

interface FlashCardProps {
  ancestorsInfo: string;
  defaultQuestion: string;
  onSubmit: (data: FlashCardForm) => void;
}

const FlashCard: React.FC<FlashCardProps> = ({ ancestorsInfo, defaultQuestion, onSubmit }) => {
  const { handleSubmit, reset } = useForm<FlashCardForm>({
    defaultValues: { cards: [{ plainText: defaultQuestion, annotations: [], answer: '' }] }
  });

  const [cards, setCards] = useState<CardData[]>([
    { plainText: defaultQuestion, annotations: [], answer: '' }
  ]);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Atualiza o formulário sempre que os cards mudam.
  useEffect(() => {
    reset({ cards });
  }, [cards, reset]);

  // Recria os cards quando defaultQuestion muda.
  useEffect(() => {
    const newCards = [{ plainText: defaultQuestion, annotations: [], answer: '' }];
    setCards(newCards);
    reset({ cards: newCards });
  }, [defaultQuestion, reset]);

  // Atualiza a resposta de um card específico.
  const handleAnswerChange = (index: number, answer: string) => {
    const newCards = [...cards];
    newCards[index].answer = answer;
    setCards(newCards);
  };

  // Usaremos o botão "Editar" presente em cada FlashCardItem
  // Assim, definimos um handler que recebe o índice do card a editar.
  const {
    modalOpen,
    setModalOpen,
    modalInput,
    setModalInput,
    currentCardIndex,
    setCurrentCardIndex,
    handlePerguntarClickOneButton,
    handleDividirClick,
    handleModalOk
  } = useFlashCardActions(cards, setCards, questionRefs);

  const handleEditCard = (index: number) => {
    // Popula o modal com os dados do card selecionado.
    setModalInput(cards[index].plainText);
    setCurrentCardIndex(index);
    setModalOpen(true);
  };

  return (
    <>
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
              <Button onClick={handlePerguntarClickOneButton} variant="outlined">
                Perguntar
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={handleDividirClick} variant="outlined" color="error">
                Dividir
              </Button>
            </Grid>
          </Grid>

          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
            {ancestorsInfo}
          </Typography>

          {/* Renderiza a lista de flashcards diretamente no FlashCard */}
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

      {/* Modal para edição ou divisão de texto */}
      {currentCardIndex !== null && (
        <FlashCardModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onOk={handleModalOk}
          inputValue={modalInput}
          setInputValue={setModalInput}
          card={cards[currentCardIndex]}
          onUpdateCard={(updatedCard: CardData) => {
            const newCards = [...cards];
            newCards[currentCardIndex] = updatedCard;
            setCards(newCards);
          }}
        />
      )}
    </>
  );
};

export default FlashCard;