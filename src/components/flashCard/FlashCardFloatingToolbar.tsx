import React, { useState, useEffect, useRef } from 'react';

interface FloatingToolbarProps {
  // Agora recebem a seleção como parâmetro, se quiser
  onPerguntar: (selectedText: string) => void;
  onDividir: (selectedText: string) => void;
}

const FlashCardFloatingToolbar: React.FC<FloatingToolbarProps> = ({
  onPerguntar,
  onDividir,
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Recalcula a posição da toolbar conforme a seleção
  const updateToolbarPosition = (e: MouseEvent | KeyboardEvent) => {
    // Se clicou/teclou dentro da toolbar, não some e não recalcule
    if (
      toolbarRef.current &&
      e.target instanceof Node &&
      toolbarRef.current.contains(e.target)
    ) {
      return;
    }

    // Verifica se há texto selecionado
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Posição: acima do texto selecionado
      const top = rect.top + window.scrollY - 8;
      const left = rect.left + window.scrollX + rect.width / 2;

      setPosition({ top, left });
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  // Listeners para atualizar a toolbar ao mouse soltar ou ao soltar uma tecla
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
      // Impede que o clique no container da toolbar desfaça a seleção
      onMouseDown={(e) => e.preventDefault()}
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
      <button
        onClick={() => {
          // Captura a seleção a cada clique
          const sel = window.getSelection();
          const selectedText = sel && !sel.isCollapsed ? sel.toString() : '';
          onPerguntar(selectedText);
        }}
        style={{ marginRight: 8 }}
      >
        Perguntar
      </button>
      <button
        onClick={() => {
          // Captura a seleção a cada clique
          const sel = window.getSelection();
          const selectedText = sel && !sel.isCollapsed ? sel.toString() : '';
          onDividir(selectedText);
        }}
      >
        Dividir
      </button>
    </div>
  );
};

export default FlashCardFloatingToolbar;
