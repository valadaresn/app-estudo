import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent
} from '@mui/material';

interface CardData {
  question: string;
  answer: string;
}

export interface FlashCardForm {
  cards: CardData[];
}

interface FlashCardProps {
  ancestorsInfo: string;
  defaultQuestion: string;
  onSubmit: (data: FlashCardForm) => void;
}

type ActionType = 'edit' | 'split';

const FlashCard: React.FC<FlashCardProps> = ({ ancestorsInfo, defaultQuestion, onSubmit }) => {
  const { handleSubmit, reset, setValue } = useForm<FlashCardForm>({
    defaultValues: { cards: [{ question: defaultQuestion, answer: '' }] }
  });

  const [cards, setCards] = useState<CardData[]>([{ question: defaultQuestion, answer: '' }]);
  const questionInputRef = useRef<HTMLDivElement | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInput, setModalInput] = useState('');
  const [selectedTextOriginal, setSelectedTextOriginal] = useState('');
  const [selRange, setSelRange] = useState<{ start: number; end: number }>({ start: 0, end: 0 });
  const [originalText, setOriginalText] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState<number | null>(null);
  const [actionType, setActionType] = useState<ActionType>('edit'); // 'edit' or 'split'

  useEffect(() => {
    reset({ cards });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  useEffect(() => {
    const newCards = [{ question: defaultQuestion, answer: '' }];
    setCards(newCards);
    reset({ cards: newCards });
  }, [defaultQuestion, reset]);

  // Função para editar um card (não split)
  const handlePerguntarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (questionInputRef.current) {
      const selection = window.getSelection();
      const start = selection?.anchorOffset || 0;
      const end = selection?.focusOffset || 0;
      const currentCard = cards[0];
      if (start !== end) {
        e.preventDefault();
        setActionType('edit');
        const selectedText = currentCard.question.substring(start, end);
        setModalInput(selectedText);
        setSelectedTextOriginal(selectedText);
        setSelRange({ start, end });
        setOriginalText(currentCard.question);
        setCurrentCardIndex(0);
        setModalOpen(true);
      }
    }
  };

  // Função para split (criar nova pergunta)
  const handleNovaPerguntaClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (questionInputRef.current) {
      const selection = window.getSelection();
      const start = selection?.anchorOffset || 0;
      const end = selection?.focusOffset || 0;
      const currentCard = cards[0];
      if (start !== end) {
        e.preventDefault();
        setActionType('split');
        const selectedText = currentCard.question.substring(start, end);
        setModalInput(selectedText);
        setSelectedTextOriginal(selectedText);
        setSelRange({ start, end });
        setOriginalText(currentCard.question);
        setCurrentCardIndex(0);
        setModalOpen(true);
      }
    }
  };

  const handleModalOk = () => {
    const replaced = `<span style="color: orange;">{${modalInput}}</span>`;
    if (currentCardIndex !== null) {
      const currentCard = cards[currentCardIndex];
      const beforeSelection = originalText.substring(0, selRange.start);
      const afterSelection = originalText.substring(selRange.end);
      if (actionType === 'edit') {
        // Atualiza o card atual sem criar novo
        const replacedText = beforeSelection + replaced + afterSelection;
        const newCards = [...cards];
        newCards[currentCardIndex] = { question: replacedText, answer: selectedTextOriginal };
        setCards(newCards);
      } else {
        // actionType === 'split'
        // Se já houver split (ou seja, mais de um card) ou for o primeiro split
        const updatedCurrentCard: CardData = { question: beforeSelection, answer: currentCard.answer };
        const newCard: CardData = { question: replaced + afterSelection, answer: selectedTextOriginal };
        const newCards = [...cards];
        // Se for o primeiro card e ele é único, fazemos split: criamos um novo card
        if (cards.length === 1) {
          newCards[0] = updatedCurrentCard;
          newCards.push(newCard);
        } else {
          // Se já houver mais de um card, inserimos após o card atual
          newCards[currentCardIndex] = updatedCurrentCard;
          newCards.splice(currentCardIndex + 1, 0, newCard);
        }
        setCards(newCards);
      }
    }
    setModalOpen(false);
    setCurrentCardIndex(null);
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
              <Button onClick={handlePerguntarClick} variant="outlined">
                Perguntar
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={handleNovaPerguntaClick} variant="outlined" color="secondary">
                Criar nova pergunta
              </Button>
            </Grid>
          </Grid>

          <Typography variant="body2" color="textSecondary" gutterBottom>
            {ancestorsInfo}
          </Typography>
          <Grid container spacing={2}>
            {cards.map((card, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  ref={index === 0 ? questionInputRef : null}
                  sx={{
                    padding: 2,
                    cursor: 'text',
                    backgroundColor: '#F5F5F5',
                    marginBottom: 2 // aumenta o espaçamento inferior para evitar sobreposição
                  }}
                >
                  <CardContent dangerouslySetInnerHTML={{ __html: card.question }} />
                </Card>
                <TextField
                  value={card.answer}
                  onChange={(e) => {
                    const newCards = [...cards];
                    newCards[index].answer = e.target.value;
                    setCards(newCards);
                  }}
                  label="Resposta"
                  multiline
                  variant="standard"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            ))}
          </Grid>

          <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Enviar Flash Card
          </Button>
        </form>
      </Box>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Texto Selecionado</DialogTitle>
        <DialogContent>
          <TextField
            value={modalInput}
            onChange={(e) => setModalInput(e.target.value)}
            label="Texto"
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleModalOk} variant="contained" color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FlashCard;