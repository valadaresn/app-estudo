import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { CardData } from '../../models/flashCardTypes';
import { useEditCardForm } from '../../hooks/useEditCardForm';

interface EditCardModalProps {
  open: boolean;
  onClose: () => void;
  defaultCard: CardData;
  onSubmit: (updatedCard: CardData) => void;
  onDelete: () => void;
}

const EditCardModal: React.FC<EditCardModalProps> = ({ open, onClose, defaultCard, onSubmit, onDelete }) => {
  const { methods, submitHandler } = useEditCardForm(defaultCard, onSubmit, onClose);
  const { register } = methods;

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
            onClick={submitHandler} 
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