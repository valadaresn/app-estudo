import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Box, AppBar, Toolbar, Typography, IconButton, TextField, Button } from '@mui/material';
import { CardData } from '../../models/flashCardTypes';
import { useEditCardForm } from '../../hooks/useEditCardForm';

// Alterada a interface para remover a prop 'open' que não é necessária para fullscreen
interface MobileEditCardProps {
  defaultCard: CardData;
  onSubmit: (updatedCard: CardData) => void;
  onDelete: () => void;
  onClose: () => void;
}

const MobileEditCard: React.FC<MobileEditCardProps> = ({ defaultCard, onSubmit, onDelete, onClose }) => {
  const { methods, submitHandler } = useEditCardForm(defaultCard, onSubmit, onClose);
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
              Editar Card
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
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
        </Box>

        <Box sx={{ 
          p: 2, 
          borderTop: 1, 
          borderColor: 'divider',
          display: 'flex', 
          justifyContent: 'space-between' 
        }}>
          <Button 
            onClick={onDelete}
            color="error"
            variant="contained"
          >
            Excluir
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

export default MobileEditCard;