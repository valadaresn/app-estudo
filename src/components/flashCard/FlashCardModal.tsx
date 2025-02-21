import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

interface FlashCardModalProps {
  open: boolean;
  onClose: () => void;
  onOk: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
}

const FlashCardModal: React.FC<FlashCardModalProps> = ({ open, onClose, onOk, inputValue, setInputValue }) => {
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