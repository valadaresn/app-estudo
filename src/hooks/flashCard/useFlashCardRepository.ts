import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, doc, writeBatch, DocumentReference } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { CardData } from '../../models/flashCardTypes';

export function useFlashCardRepository(leiId: string) {
  const [cardData, setCardData] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Carregar flashcards quando o leiId mudar
  const loadFlashcards = useCallback(async () => {
    setLoading(true);
    try {
      const flashcardsRef = collection(db, 'flashcards');
      const q = query(flashcardsRef, where('leiId', '==', leiId));
      const querySnapshot = await getDocs(q);
      
      const cards: CardData[] = [];
      querySnapshot.forEach((doc) => {
        // Agora podemos mapear diretamente para CardData
        cards.push({ 
          id: doc.id, 
          ...doc.data() 
        } as CardData);
      });
      
      setCardData(cards);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      console.error('Erro ao carregar flashcards:', err);
    } finally {
      setLoading(false);
    }
  }, [leiId]);

  useEffect(() => {
    loadFlashcards();
  }, [loadFlashcards]);

  // Salvar flashcards no Firebase
  const saveFlashCards = async (cards: CardData[]) => {
    if (!leiId) return cards;
    
    try {
      // Garantir que todos os cards tenham leiId
      const cardsWithLeiId = cards.map(card => ({
        ...card,
        leiId
      }));
      
      const now = new Date();
      const batch = writeBatch(db);
      
      // Separar cards em novos e existentes
      const existingCards = cardsWithLeiId.filter(card => card.id);
      const newCards = cardsWithLeiId.filter(card => !card.id);
      
      // Atualizar cards existentes
      existingCards.forEach(card => {
        const cardRef = doc(db, 'flashcards', card.id!);
        batch.update(cardRef, {
          plainText: card.plainText,
          answer: card.answer,
          originalText: card.originalText,
          modificado: now
        });
      });
      
      // Criar referências para novos cards
      const newCardsRefs: DocumentReference[] = [];
      newCards.forEach(card => {
        const newCardRef = doc(collection(db, 'flashcards'));
        newCardsRefs.push(newCardRef);
        batch.set(newCardRef, {
          ...card,
          criado: now,
          modificado: now
        });
      });
      
      // Executar batch
      await batch.commit();
      
      // Atribuir IDs aos novos cards no estado local
      if (newCardsRefs.length > 0) {
        const updatedCards = [...cards];
        let newCardIndex = 0;
        
        for (let i = 0; i < updatedCards.length; i++) {
          if (!updatedCards[i].id) {
            updatedCards[i].id = newCardsRefs[newCardIndex].id;
            updatedCards[i].leiId = leiId;
            newCardIndex++;
          }
        }
        
        setCardData(updatedCards);
        return updatedCards;
      }
      
      return cardsWithLeiId;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao salvar flashcards'));
      console.error('Erro ao salvar flashcards:', err);
      return cards;
    }
  };
  
  return {
    cardData,
    loading,
    error,
    saveFlashCards,
    loadFlashcards
  };
}