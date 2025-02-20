import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Typography, TextField, Button, Grid, Box, Dialog, DialogTitle, DialogContent, DialogActions, Card, CardContent } from '@mui/material';

export interface FlashCardForm {
  question: string;
  answer: string;
}

interface FlashCardProps {
  ancestorsInfo: string;
  defaultQuestion: string;
  onSubmit: (data: FlashCardForm) => void;
}

const FlashCard: React.FC<FlashCardProps> = ({ ancestorsInfo, defaultQuestion, onSubmit }) => {
  const { register, handleSubmit, reset, setValue, getValues } = useForm<FlashCardForm>({
    defaultValues: { question: defaultQuestion, answer: '' }
  });

  const questionInputRef = useRef<HTMLDivElement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInput, setModalInput] = useState('');
  // Nova variável para guardar o texto originalmente selecionado
  const [selectedTextOriginal, setSelectedTextOriginal] = useState('');
  const [selRange, setSelRange] = useState<{ start: number; end: number }>({ start: 0, end: 0 });
  const [originalQuestion, setOriginalQuestion] = useState('');

  useEffect(() => {
    reset({ question: defaultQuestion, answer: '' });
  }, [defaultQuestion, reset]);

  const handlePerguntarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (questionInputRef.current) {
      const selection = window.getSelection();
      const start = selection?.anchorOffset || 0;
      const end = selection?.focusOffset || 0;
      const currentQuestion = getValues('question');

      // Se houver seleção de texto, abre o modal e guarda o valor originalmente selecionado.
      if (start !== end) {
        e.preventDefault();
        const selectedText = currentQuestion.substring(start, end);
        setModalInput(selectedText);
        setSelectedTextOriginal(selectedText); // Salva o valor originalmente selecionado.
        setSelRange({ start, end });
        setOriginalQuestion(currentQuestion);
        setModalOpen(true);
      }
      // Se não houver seleção, permite o submit normalmente.
    }
  };

  const handleModalOk = () => {
    // Substitui o texto selecionado pelo texto do modal envolto em chaves e com cor laranja.
    const replaced = `<span style="color: orange;">{${modalInput}}</span>`;
    const newQuestion = originalQuestion.substring(0, selRange.start) + replaced + originalQuestion.substring(selRange.end);
    setValue('question', newQuestion);
    // Coloca o texto originalmente selecionado, e não o texto editado, no campo resposta.
    setValue('answer', selectedTextOriginal);
    setModalOpen(false);
  };

  return (
    <>
      <Box 
        sx={{ 
          borderRadius: 2,
          boxShadow: 1,
          padding: 2,
          backgroundColor: 'background.paper',
          width: '100vh', 
          margin: -50 
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Button onClick={handlePerguntarClick} variant="outlined">
            Perguntar
          </Button>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {ancestorsInfo}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Card ref={questionInputRef} sx={{ padding: 2, cursor: 'text', backgroundColor: '#F5F5F5' }}>
                <CardContent dangerouslySetInnerHTML={{ __html: getValues('question') }} />
              </Card>
            </Grid>
            <Grid item xs={4}>
              <TextField
                {...register('answer')}
                label="Resposta"
                multiline              
                variant="standard"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
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
          <Button onClick={handleModalOk} variant="contained" color="primary">Ok</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FlashCard;