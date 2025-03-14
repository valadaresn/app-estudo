import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { CardData } from '../../models/flashCardTypes';
import { useFlashCardForm } from '../../hooks/useFlashCardForm';

interface FlashCardModalProps {
  open: boolean;
  onClose: () => void;
  defaultCard: CardData;
  defaultInput: string;
  onSubmit: (updatedCard: CardData) => void;
  selRange: { start: number; end: number };
  originalSelection: string;
}

const FlashCardModal: React.FC<FlashCardModalProps> = ({
  open,
  onClose,
  defaultCard,
  defaultInput,
  onSubmit,
  selRange,
  originalSelection
}) => {
  const { methods, submitHandler } = useFlashCardForm({
    defaultCard,
    defaultInput,
    onSubmit,
    onClose,
    selRange,
    originalSelection
  });
  
  const { register } = methods;

  return (
    <FormProvider {...methods}>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Editar Texto Selecionado</DialogTitle>
        
        <DialogContent>
          <TextField
            {...register('inputValue')}
            label="Texto"
            fullWidth
            margin="normal"
            autoFocus
          />
          <TextField
            {...register('answer')}
            label="Answer (não será usado)"
            fullWidth
            margin="normal"
            helperText="O answer será preenchido com a seleção original."
            disabled
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={submitHandler} 
            variant="contained" 
            color="primary"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
};

export default FlashCardModal;