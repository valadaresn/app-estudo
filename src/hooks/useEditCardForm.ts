import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CardData } from '../models/flashCardTypes';

export interface EditFormData {
  plainText: string;
  answer: string;
  originalText: string;
}

export function useEditCardForm(defaultCard: CardData, onSubmit: (card: CardData) => void, onClose: () => void) {
  const methods = useForm<EditFormData>({
    defaultValues: {
      plainText: defaultCard.plainText,
      answer: defaultCard.answer,
      originalText: defaultCard.originalText
    }
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    reset({
      plainText: defaultCard.plainText,
      answer: defaultCard.answer,
      originalText: defaultCard.originalText
    });
  }, [defaultCard, reset]);

  const submitHandler = (data: EditFormData) => {
    const updatedCard: CardData = {     
      plainText: data.plainText,
      answer: data.answer,
      originalText: defaultCard.originalText
    };
    onSubmit(updatedCard);
    onClose();
  };

  return {
    methods,
    submitHandler: handleSubmit(submitHandler)
  };
}