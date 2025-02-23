import React, { useState, useEffect, useRef } from 'react';

interface FloatingToolbarProps {
  onPerguntar: (selection: Selection) => void;
  onDividir: (selection: Selection) => void;
}

const FlashCardFloatingToolbar: React.FC<FloatingToolbarProps> = ({
  onPerguntar,
  onDividir,
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  const updateToolbarPosition = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const top = rect.top + window.scrollY - 8;
      const left = rect.left + window.scrollX + rect.width / 2;
      setPosition({ top, left });
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handlePerguntar = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      onPerguntar(selection);
    }
  };

  const handleDividir = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      onDividir(selection);
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', updateToolbarPosition);
    document.addEventListener('keyup', updateToolbarPosition);
    return () => {
      document.removeEventListener('mouseup', updateToolbarPosition);
      document.removeEventListener('keyup', updateToolbarPosition);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={toolbarRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        transform: 'translate(-50%, -100%)',
        background: '#fff',
        border: '1px solid #ccc',
        borderRadius: 4,
        padding: 4,
        zIndex: 1000,
        boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
      }}
    >
      <button onClick={handlePerguntar} style={{ marginRight: 8 }}>
        Perguntar
      </button>
      <button onClick={handleDividir}>
        Dividir
      </button>
    </div>
  );
};

export default FlashCardFloatingToolbar;