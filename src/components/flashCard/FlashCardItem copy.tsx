import React, { useState } from 'react';
import { CardData } from '../../models/flashCardTypes';
import { Box, Grid, Typography, TextField, Button } from '@mui/material';
import FlipIcon from '@mui/icons-material/Flip';

interface FlashCardItemProps {
  card: CardData;
  index: number;
  questionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  onEdit: (index: number) => void;
  onAnswerChange: (index: number, answer: string) => void;
  hideFeedback?: boolean;
}

/**
 * FlashCardItem renderiza um único flash card, exibindo o texto formatado
 * (com anotações) e um input para a resposta. Contém também um botão "Editar"
 * que, ao ser clicado, abre o modal para editar o card (tanto a resposta como a questão,
 * sendo que o texto da questão é exibido em modo disable).
 * 
 * O parâmetro hideFeedback controla a exibição do campo de resposta para visualização em dispositivos móveis.
 */
const FlashCardItem: React.FC<FlashCardItemProps> = ({
  card,
  index,
  questionRefs,
  onEdit,
  onAnswerChange,
  hideFeedback = false
}) => {
  // Estado para controlar se o cartão está virado ou não
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Função para virar o cartão
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Variable for the orange color
  const orangeColor = "#FFA500";

  // This function searches for any text between braces and wraps it in a span styled in orange.
  const highlightText = (text: string) => {
    const regex = /{([^}]+)}/g;
    let lastIndex = 0;
    const elements: React.ReactNode[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        elements.push(text.substring(lastIndex, match.index));
      }
      elements.push(
        <span key={match.index} style={{ color: orangeColor }}>
          {match[0]}
        </span>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      elements.push(text.substring(lastIndex));
    }
    return elements;
  };

  return (
    <Grid item xs={12}>
      <Box sx={{ position: 'relative' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={hideFeedback ? 12 : 8}>
            <Box sx={{ display: 'flex', position: 'relative' }}>
              {/* Conteúdo principal do cartão */}
              <Box
                component="div"
                ref={(el: HTMLDivElement | null) => {
                  questionRefs.current[index] = el;
                }}
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: 2,
                  cursor: 'text',
                  backgroundColor: '#F5F5F5',
                  borderRadius: '4px 0 0 4px', // Arredonda apenas os cantos esquerdos
                  height: 'auto',
                  position: 'relative',
                  minHeight: '100px'
                }}
              >
                {!isFlipped ? (
                  // Frente do cartão (pergunta)
                  <Typography component="div">
                    {highlightText(card.plainText)}
                  </Typography>
                ) : (
                  // Verso do cartão (resposta)
                  <Typography component="div">
                    {card.answer}
                  </Typography>
                )}
              </Box>
              
              {/* Barra lateral com botão de flip */}
              <Box
                sx={{
                  width: '24px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '0 4px 4px 0', // Arredonda apenas os cantos direitos
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={handleFlip}
              >
                <FlipIcon sx={{ fontSize: '18px', color: '#555' }} />
              </Box>
            </Box>
          </Grid>
          
          {!hideFeedback && (
            <Grid item xs={4}>
              <TextField
                label="Resposta"
                multiline
                variant="standard"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={card.answer}
                onChange={(e) => onAnswerChange(index, e.target.value)}
              />
              <Button
                onClick={() => onEdit(index)}
                variant="outlined"
                sx={{ marginTop: 1 }}
              >
                Editar
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    </Grid>
  );
};

export default FlashCardItem;