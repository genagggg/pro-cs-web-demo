import React from 'react';

import useFPS from '../hooks/useFPS';

const FPSDisplay: React.FC = () => {
  const fps = useFPS();

  const getColor = (): string => {
    if (fps >= 50) return '#4caf50';
    if (fps >= 30) return '#ff9800';
    return '#f44336';
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 12,
      right: 12,
      zIndex: 10000,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      color: '#fff',
      padding: '4px 10px',
      borderRadius: 6,
      fontFamily: 'monospace',
      fontSize: 13,
      lineHeight: 1.4,
      pointerEvents: 'none',
      userSelect: 'none',
    }}>
      <span style={{ color: getColor(), fontWeight: 700 }}>{fps}</span> FPS
    </div>
  );
};

export default FPSDisplay;
