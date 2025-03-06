import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Box, AppBar, Toolbar, Typography, IconButton, TextField, Button } from '@mui/material';
import { CardData } from '../../models/flashCardTypes';
import { useFlashCardForm } from '../../hooks/useFlashCardForm';

interface MobileFlashCardModalProps {
  defaultCard: CardData;
  defaultInput: string;
  onSubmit: (updatedCard: CardData) => void;
  onClose: () => void;
  selRange: { start: number; end: number };
  originalSelection: string;
}

const MobileFlashCardModal: React.FC<MobileFlashCardModalProps> = ({
  defaultCard,
  defaultInput,
  onSubmit,
  onClose,
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
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={onClose}>
              <span style={{ fontSize: '24px' }}>←</span>
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>
              Editar Texto Selecionado
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
          <TextField
            {...register('inputValue')}
            label="Texto"
            fullWidth
            margin="normal"
            autoFocus
            multiline
            rows={3}
          />
          <TextField
            {...register('answer')}
            label="Answer"
            fullWidth
            margin="normal"
            helperText="O answer será preenchido com a seleção original."
            disabled
            multiline
            rows={2}
          />
        </Box>

        <Box sx={{ 
          p: 2, 
          borderTop: 1, 
          borderColor: 'divider',
          display: 'flex', 
          justifyContent: 'space-between' 
        }}>
          <Button 
            onClick={onClose}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button 
            onClick={submitHandler} 
            variant="contained" 
            color="primary"
          >
            Salvar
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default MobileFlashCardModal;