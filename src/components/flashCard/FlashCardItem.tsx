import React from 'react';
import { CardData } from '../../models/flashCardTypes';
import { formatText } from '../../util/textUtils';
import { Box, Grid, Typography, TextField, Button } from '@mui/material';

interface FlashCardItemProps {
  card: CardData;
  index: number;
  questionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  onEdit: (index: number) => void;
  onAnswerChange: (index: number, answer: string) => void;
}

/**
 * FlashCardItem é um componente que renderiza um único flash card,
 * exibindo o texto formatado (com anotações) e um input para a resposta.
 * Também oferece um botão para disparar a edição do card.
 *
 * Props:
 * - card: Dados do flash card (texto, anotações e resposta).
 * - index: Índice do card na lista.
 * - questionRefs: Referências para os elementos DOM dos cards.
 * - onEdit: Função chamada quando o botão de edição é clicado.
 * - onAnswerChange: Função chamada ao alterar o input de resposta.
 */
const FlashCardItem: React.FC<FlashCardItemProps> = ({
  card,
  index,
  questionRefs,
  onEdit,
  onAnswerChange
}) => {
  return (
    <Grid item xs={12}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={8}>
          <Box
            component="div"
            ref={(el: HTMLDivElement | null) => {
              questionRefs.current[index] = el;
            }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: 2,
              cursor: 'text',
              backgroundColor: '#F5F5F5',
              borderRadius: 1,
              height: 'auto'
            }}
          >
            <Typography
              component="div"
              dangerouslySetInnerHTML={{
                __html: formatText(card.plainText, card.annotations)
              }}
            />
          </Box>
        </Grid>
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
      </Grid>
    </Grid>
  );
};

export default FlashCardItem;