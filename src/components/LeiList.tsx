import React from 'react';
import { Lei } from '../models/Lei';
import { Divider } from '@mui/material';

interface LeiListProps {
  data: Lei[];
  onSelectionChange: (index: number) => void;
  selectedIndex: number; // Adiciona a propriedade selectedIndex
}

const LeiList: React.FC<LeiListProps> = ({ data, onSelectionChange, selectedIndex }) => {
  return (
    <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
      {data.map((lei, index) => (
        <React.Fragment key={index}>
          <li
            onClick={() => onSelectionChange(index)}
            style={{
              cursor: 'pointer',
              textAlign: 'justify',
              padding: '8px 14px', // usa padding em vez de margin para incluir a cor de fundo
              fontSize: '0.9em',
              backgroundColor: index === selectedIndex ? '#d3d3d3' : 'transparent',
            }}
          >
            {lei.dispositivo}
          </li>
          {index < data.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </ul>
  );
};

export default LeiList;