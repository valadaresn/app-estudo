import React, { useState, useRef, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Box, Grid, Typography, Button } from '@mui/material';
import { FlashCardForm, CardData } from '../../models/flashCardTypes';
import FlashCardItem from './FlashCardItem';
import FlashCardModal from './FlashCardModal';
import EditCardModal from './/EditCardModal';
import useFlashCardActions from '../../hooks/useFlashCardActions';
import FlashCardFloatingToolbar from './FlashCardFloatingToolbar';

interface FlashCardProps {
  ancestorsInfo: string;
  defaultQuestion: string;
  onSubmit: (data: FlashCardForm) => void;
}

const FlashCard: React.FC<FlashCardProps> = ({ ancestorsInfo, defaultQuestion, onSubmit }) => {
  // Inicializa os métodos do react-hook-form com os valores iniciais atualizados
  const methods = useForm<FlashCardForm>({
    defaultValues: {
      cards: [
        { plainText: defaultQuestion, originalText: defaultQuestion, answer: '' }
      ]
    }
  });
  const { handleSubmit, reset } = methods;

  // Estado dos cards (modelo atualizado sem annotations)
  const [cards, setCards] = useState<CardData[]>([
    { plainText: defaultQuestion, originalText: defaultQuestion, answer: '' }
  ]);
  
  // Referências aos elementos de cada card para auxiliar na captura da seleção
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  // Extrai os métodos do hook centralizado em useFlashCardActions
  const {
    modalOpen,
    setModalOpen, // Função de fechamento do modal (handleCloseModal)
    modalInput,
    currentCardIndex,
    editModalOpen,
    setEditModalOpen, 
    currentEditCardIndex,
    handlePerguntarClickOneButton,
    handleDividirClick,
    handleEditCard,
    handleUpdateCard,
    handleAnswerChange,
    selRange,
    originalSelection,
    handleDeleteCard
  } = useFlashCardActions(cards, setCards, questionRefs);

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
            {/* Botão para perguntar (abrir modal de pergunta) */}
            <Grid item>
              <Button
                onClick={() => handlePerguntarClickOneButton(window.getSelection()!)}
                variant="outlined"
              >
                Perguntar
              </Button>
            </Grid>
            {/* Botão para dividir o card */}
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

          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
            {ancestorsInfo}
          </Typography>

          <Grid container spacing={2}>
            {/* Renderiza cada FlashCardItem */}
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

      {/* Toolbar flutuante com ações de perguntar e dividir */}
      <FlashCardFloatingToolbar
        onPerguntar={handlePerguntarClickOneButton}
        onDividir={handleDividirClick}
      />

      {/* Modal para edição com a função de perguntar */}
      {currentCardIndex !== null && (
        <FlashCardModal
          open={modalOpen}
          onClose={setModalOpen} // Função de fechamento do modal (sem argumentos)
          defaultCard={cards[currentCardIndex]}
          defaultInput={modalInput}
          onSubmit={(updatedCard: CardData) => {
            // Atualiza o card usando o método centralizado
            handleUpdateCard(updatedCard);
          }}
          selRange={selRange}
          originalSelection={originalSelection}
        />
      )}

      {/* Modal para edição do card */}
      {currentEditCardIndex !== null && (
        <EditCardModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}  // Utilize a mesma função de fechamento sem passar argumentos
          defaultCard={cards[currentEditCardIndex]}
          onSubmit={handleUpdateCard}
          onDelete={() => handleDeleteCard(currentEditCardIndex)}
        />
      )}
    </FormProvider>
  );
};

export default FlashCard;