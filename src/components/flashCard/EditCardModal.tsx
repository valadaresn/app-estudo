import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { CardData } from '../../models/flashCardTypes';

interface EditCardModalProps {
  open: boolean;
  onClose: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  card: CardData; // Card selecionado
  setCards: React.Dispatch<React.SetStateAction<CardData[]>>; // Atualiza os cards
  currentCardIndex: number | null;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentCardIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

// Função para atualizar o card substituindo o plainText pelo novo texto
const updateCardSimpleEdit = (card: CardData, newText: string): CardData => {
  return { ...card, plainText: newText };
};

const EditCardModal: React.FC<EditCardModalProps> = ({
  open,
  onClose,
  inputValue,
  setInputValue,
  card,
  setCards,
  currentCardIndex,
  setModalOpen,
  setCurrentCardIndex
}) => {
  const handleModalEdit = () => {
    if (currentCardIndex === null) return;
    const newCard = updateCardSimpleEdit(card, inputValue);
    setCards((prevCards) => {
      const newCards = [...prevCards];
      newCards[currentCardIndex] = newCard;
      return newCards;
    });
    setModalOpen(false);
    setCurrentCardIndex(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Texto do Card</DialogTitle>
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
          onChange={(e) => setCards((prevCards) => {
            const updatedCard = { ...card, answer: e.target.value };
            const newCards = [...prevCards];
            newCards[currentCardIndex!] = updatedCard;
            return newCards;
          })}
          label="Answer"
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleModalEdit} variant="contained" color="secondary">
          Editar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCardModal;