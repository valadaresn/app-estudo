import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { CardData } from '../../models/flashCardTypes';
import { modifyCardText } from '../../util/flashCardUtils';

interface FlashModalFormData {
  inputValue: string;
  answer: string;
}

interface FlashCardModalProps {
  open: boolean;
  onClose: () => void;
  defaultCard: CardData;
  defaultInput: string; // A seleção do usuário, não o texto inteiro do card
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
  const methods = useForm<FlashModalFormData>({
    defaultValues: {
      inputValue: defaultInput,
      answer: defaultCard.answer
    }
  });
  const { handleSubmit, register } = methods;

  const submitHandler = (data: FlashModalFormData) => {
    const modifiedCard = modifyCardText(defaultCard, selRange, data.inputValue, originalSelection);
    // Preenche o answer com o texto que o usuário selecionou originalmente:
    modifiedCard.answer = originalSelection; 
    onSubmit(modifiedCard);
  };

  return (
    <FormProvider {...methods}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Texto Selecionado</DialogTitle>
        <DialogContent>
          <TextField
            {...register('inputValue')}
            label="Texto"
            fullWidth
            margin="normal"
          />
          <TextField
            {...register('answer')}
            label="Answer (não será usado)"
            fullWidth
            margin="normal"
            helperText="O answer será preenchido com a seleção original."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit(submitHandler)} variant="contained" color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
};

export default FlashCardModal;