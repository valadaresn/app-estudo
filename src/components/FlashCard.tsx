import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, Typography, TextField, Button } from '@mui/material';

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
    defaultValues: { question: defaultQuestion, answer: "" }
  });

  // Atualiza o formulário sempre que defaultQuestion mudar
  useEffect(() => {
    reset({ question: defaultQuestion, answer: "" });
  }, [defaultQuestion, reset]);

  return (
    <Card sx={{ width: 800, margin: '0 auto' }}>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>

          <Typography variant="body2" color="textSecondary" gutterBottom>
            {ancestorsInfo}
          </Typography>
          <TextField
            {...register("question")}
            label="Pergunta"
            multiline
            rows={6}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            {...register("answer")}
            label="Resposta"
            multiline
            rows={6}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: "1rem" }}>
            Enviar Flash Card
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FlashCard;