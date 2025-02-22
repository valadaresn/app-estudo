import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { CardData } from '../../models/flashCardTypes';

interface EditFormData {
  plainText: string;
  answer: string;
}

interface EditCardModalProps {
  open: boolean;
  onClose: () => void;
  defaultCard: CardData;
  onSubmit: (updatedCard: CardData) => void;
}

const EditCardModal: React.FC<EditCardModalProps> = ({ open, onClose, defaultCard, onSubmit }) => {
  const methods = useForm<EditFormData>({
    defaultValues: {
      plainText: defaultCard.plainText,
      answer: defaultCard.answer
    }
  });
  const { handleSubmit, register } = methods;

  const submitHandler = (data: EditFormData) => {
    const updatedCard: CardData = { ...defaultCard, plainText: data.plainText, answer: data.answer };
    onSubmit(updatedCard);
  };

  return (
    <FormProvider {...methods}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Card</DialogTitle>
        <DialogContent>
          <TextField
            {...register('plainText')}
            label="Texto"
            fullWidth
            margin="normal"
          />
          <TextField
            {...register('answer')}
            label="Answer"
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit(submitHandler)} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
};

export default EditCardModal;