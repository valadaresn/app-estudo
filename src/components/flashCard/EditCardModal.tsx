import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { CardData } from '../../models/flashCardTypes';

interface EditFormData {
  plainText: string;
  answer: string;
  originalText: string;
}

interface EditCardModalProps {
  open: boolean;
  onClose: () => void;
  defaultCard: CardData;
  onSubmit: (updatedCard: CardData) => void;
  onDelete: () => void;
}

const EditCardModal: React.FC<EditCardModalProps> = ({ open, onClose, defaultCard, onSubmit, onDelete}) => {
  const methods = useForm<EditFormData>({
    defaultValues: {
      plainText: defaultCard.plainText,
      answer: defaultCard.answer,
      originalText: defaultCard.originalText
    }
  });

  const { handleSubmit, register, reset } = methods;

  useEffect(() => {
    reset({
      plainText: defaultCard.plainText,
      answer: defaultCard.answer,
      originalText: defaultCard.originalText
    });
  }, [defaultCard, reset]);

  const submitHandler = (data: EditFormData) => {
    const updatedCard: CardData = {     
      plainText: data.plainText,
      answer: data.answer,
      originalText: defaultCard.originalText
    };
    onSubmit(updatedCard);
    onClose();
  };

  return (
    <FormProvider {...methods}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Card</DialogTitle>
        <DialogContent>
          <TextField
            {...register('originalText')}
            label="Texto Original"
            fullWidth
            margin="normal"
            disabled
            helperText="Este é o texto original do card"
            multiline
            rows={3}
          />
          <TextField
            {...register('plainText')}
            label="Texto"
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            {...register('answer')}
            label="Answer"
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={onDelete}
            color="error"
            sx={{ marginRight: 'auto' }}
          >
            Excluir Card
          </Button>
          <Button onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit(submitHandler)} 
            variant="contained" 
            color="primary"
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
};

export default EditCardModal;