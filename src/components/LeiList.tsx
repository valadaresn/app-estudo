import React from 'react';
import { Lei } from '../models/Lei';
import { Divider } from '@mui/material';

interface LeiListProps {
  data: Lei[];
  onSelectionChange: (index: number) => void;
}

const LeiList: React.FC<LeiListProps> = ({ data, onSelectionChange }) => {
  return (
    <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
      {data.map((lei, index) => (
        <React.Fragment key={index}>
          <li
            onClick={() => onSelectionChange(index)}
            style={{ cursor: 'pointer', textAlign: 'justify', padding: '8px 0', marginLeft: '14px', marginRight: '14px', fontSize: '0.9em' }}
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