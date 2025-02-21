import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { CardData } from '../../models/flashCardTypes';

interface FlashCardModalProps {
  open: boolean;
  onClose: () => void;
  onOk: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  card: CardData; // Card selecionado
  onUpdateCard: (updatedCard: CardData) => void; // Atualiza o card
}

const FlashCardModal: React.FC<FlashCardModalProps> = ({ 
  open, 
  onClose, 
  onOk, 
  inputValue, 
  setInputValue,
  card,
  onUpdateCard
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Texto Selecionado</DialogTitle>
      <DialogContent>
        <TextField
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          label="Texto"
          fullWidth
          margin="normal"
        />
        <TextField
          value={card.plainText}
          label="Plain Text"
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          value={card.answer}
          onChange={(e) => onUpdateCard({ ...card, answer: e.target.value })}
          label="Answer"
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onOk} variant="contained" color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FlashCardModal;