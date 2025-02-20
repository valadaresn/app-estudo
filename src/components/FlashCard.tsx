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
  DialogActions
} from '@mui/material';

interface Annotation {
  start: number;
  end: number;
  style: string;
}

interface CardData {
  // O conteúdo puro sem formatação
  plainText: string;
  // As anotações de formatação
  annotations: Annotation[];
  answer: string;
}

export interface FlashCardForm {
  cards: CardData[];
}

interface FlashCardProps {
  ancestorsInfo: string;
  defaultQuestion: string; // texto puro
  onSubmit: (data: FlashCardForm) => void;
}

// Função para formatar o texto puro com base nas anotações
function formatText(plainText: string, annotations: Annotation[]): string {
  let formatted = "";
  let lastIndex = 0;
  const sorted = [...annotations].sort((a, b) => a.start - b.start);
  sorted.forEach(({ start, end, style }) => {
    formatted += plainText.substring(lastIndex, start);
    formatted += `<span style="color: ${style};">${plainText.substring(start, end)}</span>`;
    lastIndex = end;
  });
  formatted += plainText.substring(lastIndex);
  return formatted;
}

// Função para converter os offsets da seleção no DOM para offsets no plainText
function getOffsetInPlainText(container: Node, target: Node, offset: number): number {
  let total = 0;
  let found = false;
  
  function traverse(node: Node): void {
    if (node === target) {
      total += offset;
      found = true;
      return;
    }
    if (node.nodeType === Node.TEXT_NODE) {
      total += node.textContent?.length || 0;
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        traverse(node.childNodes[i]);
        if (found) break;
      }
    }
  }
  
  traverse(container);
  return total;
}

const FlashCard: React.FC<FlashCardProps> = ({ ancestorsInfo, defaultQuestion, onSubmit }) => {
  const { handleSubmit, reset } = useForm<FlashCardForm>({
    defaultValues: { cards: [{ plainText: defaultQuestion, annotations: [], answer: '' }] }
  });

  // Estado dos cards – cada card possui o texto puro e as anotações
  const [cards, setCards] = useState<CardData[]>([{ plainText: defaultQuestion, annotations: [], answer: '' }]);
  // Refs para acessar o DOM de cada card
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Estado do modal e seleção
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInput, setModalInput] = useState('');
  // Guardamos os offsets relativos ao plainText
  const [selRange, setSelRange] = useState({ start: 0, end: 0 });
  const [currentCardIndex, setCurrentCardIndex] = useState<number | null>(null);
  const [actionType, setActionType] = useState<'edit' | 'split'>('edit');

  useEffect(() => {
    reset({ cards });
  }, [cards, reset]);

  useEffect(() => {
    const newCards = [{ plainText: defaultQuestion, annotations: [], answer: '' }];
    setCards(newCards);
    reset({ cards: newCards });
  }, [defaultQuestion, reset]);

  // Identifica qual card está selecionado com base no container
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

  // Handler genérico para seleção, para "edit" ou "split"
  const handleSelection = (e: React.MouseEvent<HTMLButtonElement>, action: 'edit' | 'split') => {
    e.preventDefault();
    const index = getSelectedCardIndex();
    if (index === null) return;
    const card = cards[index];
    const ref = questionRefs.current[index];
    if (!ref) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

    // Obtemos os offsets corretos no plainText usando o innerText do container
    const container = ref;
    const start = getOffsetInPlainText(container, selection.anchorNode!, selection.anchorOffset);
    const end = getOffsetInPlainText(container, selection.focusNode!, selection.focusOffset);
    if (start === end) return;

    setActionType(action);
    const selectedText = card.plainText.substring(Math.min(start, end), Math.max(start, end));
    setModalInput(selectedText);
    setSelRange({ start: Math.min(start, end), end: Math.max(start, end) });
    setCurrentCardIndex(index);
    setModalOpen(true);
  };

  const handlePerguntarClickOneButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleSelection(e, 'edit');
  };

  const handleNovaPerguntaClickOneButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleSelection(e, 'split');
  };

  // Ao confirmar no modal:
  // Para "edit": substituímos o trecho do plainText pelo novo texto (entre chaves)
  // e atualizamos as anotações para refletir o novo intervalo com o estilo "orange"
  const handleModalOk = () => {
    if (currentCardIndex !== null) {
      const card = cards[currentCardIndex];
      if (actionType === 'edit') {
        // Novo texto com chaves
        const replacedTextWithBraces = `{${modalInput}}`;
        // Atualiza o plainText, substituindo o trecho selecionado pelo novo texto
        const newPlainText =
          card.plainText.substring(0, selRange.start) +
          replacedTextWithBraces +
          card.plainText.substring(selRange.end);
        // Cria uma nova anotação para esse intervalo
        const newAnnotation = {
          start: selRange.start,
          end: selRange.start + replacedTextWithBraces.length,
          style: 'orange'
        };
        // Filtra as anotações antigas que não interferem com o intervalo substituído
        const filteredAnnotations = card.annotations.filter(
          (a) => a.end <= selRange.start || a.start >= selRange.end
        );
        // Adiciona a nova anotação e ordena
        const newAnnotations = [...filteredAnnotations, newAnnotation].sort((a, b) => a.start - b.start);
        const newCard: CardData = { plainText: newPlainText, annotations: newAnnotations, answer: card.answer };
        const newCards = [...cards];
        newCards[currentCardIndex] = newCard;
        setCards(newCards);
      } else {
        // Lógica para 'split'
        const beforeText = card.plainText.substring(0, selRange.start);
        const selectedText = card.plainText.substring(selRange.start, selRange.end);
        const afterText = card.plainText.substring(selRange.end);
        const updatedCard: CardData = {
          plainText: beforeText,
          annotations: card.annotations.filter(a => a.end <= selRange.start),
          answer: card.answer
        };
        const newCard: CardData = {
          plainText: afterText,
          annotations: card.annotations.filter(a => a.start >= selRange.end),
          answer: selectedText
        };
        const newCards = [...cards];
        if (cards.length === 1) {
          newCards[0] = updatedCard;
          newCards.push(newCard);
        } else {
          newCards[currentCardIndex] = updatedCard;
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
                    <Box
                      component="div"
                      ref={(el: HTMLDivElement | null) => {
                        questionRefs.current[index] = el;
                      }}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: 2,
                        cursor: 'text',
                        backgroundColor: '#F5F5F5',
                        borderRadius: 1,
                        height: 'auto'
                      }}
                    >
                      <Typography
                        sx={{ whiteSpace: 'pre-wrap' }}
                        dangerouslySetInnerHTML={{
                          __html: formatText(card.plainText, card.annotations)
                        }}
                      />
                    </Box>
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
