import { useForm } from 'react-hook-form';
import { CardData } from '../models/flashCardTypes';
import { modifyCardText } from '../util/flashCardUtils';

export interface FlashModalFormData {
  inputValue: string;
  answer: string;
}

interface UseFlashCardFormProps {
  defaultCard: CardData;
  defaultInput: string;
  onSubmit: (updatedCard: CardData) => void;
  onClose: () => void;
  selRange: { start: number; end: number };
  originalSelection: string;
}

export function useFlashCardForm({
  defaultCard,
  defaultInput,
  onSubmit,
  onClose,
  selRange,
  originalSelection
}: UseFlashCardFormProps) {
  const methods = useForm<FlashModalFormData>({
    defaultValues: {
      inputValue: defaultInput,
      answer: defaultCard.answer
    }
  });
  
  const { handleSubmit } = methods;

  const submitHandler = (data: FlashModalFormData) => {
    const modifiedCard = modifyCardText(
      defaultCard, 
      selRange, 
      data.inputValue, 
      originalSelection
    );
    
    // Preenche o answer com o texto que o usuário selecionou originalmente
    modifiedCard.answer = originalSelection;
    
    // Submete as alterações e fecha o modal
    onSubmit(modifiedCard);
    onClose();
  };

  return {
    methods,
    submitHandler: handleSubmit(submitHandler)
  };
}