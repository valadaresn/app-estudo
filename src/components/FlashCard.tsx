import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Typography, TextField, Button, Grid, Box } from '@mui/material';

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
  const { register, handleSubmit, reset } = useForm<FlashCardForm>({
    defaultValues: { question: defaultQuestion, answer: '' }
  });

  useEffect(() => {
    reset({ question: defaultQuestion, answer: '' });
  }, [defaultQuestion, reset]);

  return (
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
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {ancestorsInfo}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              {...register('question')}
              label="Pergunta"
              multiline
              
              variant="filled"
              fullWidth
              margin="normal"
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
  );
};

export default FlashCard;