import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Typography, TextField, Button, Grid, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

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

  const questionInputRef = useRef<HTMLInputElement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInput, setModalInput] = useState('');
  const [selRange, setSelRange] = useState<{ start: number; end: number }>({ start: 0, end: 0 });
  const [originalQuestion, setOriginalQuestion] = useState('');

  useEffect(() => {
    reset({ question: defaultQuestion, answer: '' });
  }, [defaultQuestion, reset]);

  const handlePerguntarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (questionInputRef.current) {
      const inputElem = questionInputRef.current;
      const start = inputElem.selectionStart || 0;
      const end = inputElem.selectionEnd || 0;
      const currentQuestion = getValues('question');

      // If there is a text selection, open modal.
      if (start !== end) {
        e.preventDefault();
        const selectedText = currentQuestion.substring(start, end);
        setModalInput(selectedText);
        setSelRange({ start, end });
        setOriginalQuestion(currentQuestion);
        setModalOpen(true);
      }
      // If no selection, let form submit normally.
    }
  };

  const handleModalOk = () => {
    // Wrap the input text in braces.
    const replaced = `{${modalInput}}`;
    // Replace the selected text with the replaced value.
    const newQuestion = originalQuestion.substring(0, selRange.start) + replaced + originalQuestion.substring(selRange.end);
    setValue('question', newQuestion);
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
              <TextField
                {...register('question')}
                inputRef={questionInputRef}
                label="Pergunta"
                multiline              
                variant="filled"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
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
            multiline
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