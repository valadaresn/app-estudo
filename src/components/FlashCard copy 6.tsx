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
  const { handleSubmit, reset } = useForm<FlashCardForm>({
    defaultValues: { cards: [{ question: defaultQuestion, answer: '' }] }
  });

  // Armazenamos cada card (pergunta/resposta)
  const [cards, setCards] = useState<CardData[]>([{ question: defaultQuestion, answer: '' }]);

  // Array de refs, um para cada card
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Estado do modal e seleção
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInput, setModalInput] = useState('');
  const [selectedTextOriginal, setSelectedTextOriginal] = useState('');
  const [selRange, setSelRange] = useState({ start: 0, end: 0 });
  const [originalText, setOriginalText] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState<number | null>(null);
  const [actionType, setActionType] = useState<ActionType>('edit');

  // Atualiza o form quando os cards mudam
  useEffect(() => {
    reset({ cards });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  // Atualiza o card inicial quando a prop defaultQuestion mudar
  useEffect(() => {
    const newCards = [{ question: defaultQuestion, answer: '' }];
    setCards(newCards);
    reset({ cards: newCards });
  }, [defaultQuestion, reset]);

  // Identifica qual card está selecionado, retornando o índice
  const getSelectedCardIndex = (): number | null => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const anchorNode = selection.anchorNode;
    for (let i = 0; i < questionRefs.current.length; i++) {
      const ref = questionRefs.current[i];
      if (ref && anchorNode && ref.contains(anchorNode)) {
        return i;
      }
    }
    return null;
  };

  // Captura seleção de texto para "Perguntar"
  const handlePerguntarClickOneButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const index = getSelectedCardIndex();
    if (index === null) return;
    const ref = questionRefs.current[index];
    if (!ref) return;
    const selection = window.getSelection();
    const start = selection?.anchorOffset || 0;
    const end = selection?.focusOffset || 0;
    if (start !== end) {
      setActionType('edit');
      const currentCard = cards[index];
      const selectedText = currentCard.question.substring(start, end);
      setModalInput(selectedText);
      setSelectedTextOriginal(selectedText);
      setSelRange({ start, end });
      setOriginalText(currentCard.question);
      setCurrentCardIndex(index);
      setModalOpen(true);
    }
  };

  // Captura seleção de texto para "Criar nova pergunta"
  const handleNovaPerguntaClickOneButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const index = getSelectedCardIndex();
    if (index === null) return;
    const ref = questionRefs.current[index];
    if (!ref) return;
    const selection = window.getSelection();
    const start = selection?.anchorOffset || 0;
    const end = selection?.focusOffset || 0;
    if (start !== end) {
      setActionType('split');
      const currentCard = cards[index];
      const selectedText = currentCard.question.substring(start, end);
      setModalInput(selectedText);
      setSelectedTextOriginal(selectedText);
      setSelRange({ start, end });
      setOriginalText(currentCard.question);
      setCurrentCardIndex(index);
      setModalOpen(true);
    }
  };

  // Confirma edição ou split no modal
  const handleModalOk = () => {
    if (currentCardIndex !== null) {
      const replacedTextWithBraces = `{${modalInput}}`;
      const currentCard = cards[currentCardIndex];
      const beforeSelection = originalText.substring(0, selRange.start);
      const afterSelection = originalText.substring(selRange.end);

      if (actionType === 'edit') {
        const replacedText = beforeSelection + replacedTextWithBraces + afterSelection;
        const newCards = [...cards];
        newCards[currentCardIndex] = { question: replacedText, answer: selectedTextOriginal };
        setCards(newCards);
      } else {
        // 'split'
        const updatedCurrentCard: CardData = {
          question: beforeSelection,
          answer: currentCard.answer
        };
        const newCard: CardData = {
          question: replacedTextWithBraces + afterSelection,
          answer: selectedTextOriginal
        };
        const newCards = [...cards];

        if (cards.length === 1) {
          // Só existe 1 card
          newCards[0] = updatedCurrentCard;
          newCards.push(newCard);
        } else {
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
          {/* Dois botões globais (Perguntar / Criar nova pergunta) */}
          <Grid container spacing={2} sx={{ marginBottom: 2 }}>
            <Grid item>
              <Button onClick={handlePerguntarClickOneButton} variant="outlined">
                Perguntar
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={handleNovaPerguntaClickOneButton} variant="outlined" color="secondary">
                Criar nova pergunta
              </Button>
            </Grid>
          </Grid>

          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
            {ancestorsInfo}
          </Typography>

          <Grid container spacing={2}>
            {cards.map((card, index) => (
              <Grid item xs={12} key={index}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8}>
                    <Card
                      ref={(el) => (questionRefs.current[index] = el)}
                      sx={{ padding: 2, cursor: 'text', backgroundColor: '#F5F5F5' }}
                    >
                      <CardContent dangerouslySetInnerHTML={{ __html: card.question }} />
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
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
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              </Grid>
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