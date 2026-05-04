/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React from 'react';
import type { RowComponentProps } from 'react-window';
import { List } from 'react-window';

import styles from '../styles/radar.module.css';
import type { Cargo } from '../types';

const getStatusText = (status: Cargo['status']): string => {
  switch (status) {
    case 'moving': return 'В движении';
    case 'stopped': return 'Остановлен';
    case 'delivered': return 'Доставлен';
    case 'pending': return 'Ожидает';
    default: return 'Неизвестно';
  }
};

interface RowProps {
  cargoes: Cargo[];
  selectedCargoId: string | null;
  onSelectCargo: (cargo: Cargo) => void;
}

type CargoRowProps = RowComponentProps<RowProps> & RowProps;

const CargoRow = React.memo(({
  index,
  style,
  cargoes,
  selectedCargoId,
  onSelectCargo,
}: CargoRowProps): React.ReactElement => {
  const cargo = cargoes[index];
  const isSelected = selectedCargoId === cargo.id;

  const statusKey = `status${cargo.status.charAt(0).toUpperCase()}${cargo.status.slice(1)}` as keyof typeof styles;

  return (
    <div style={style}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        onClick={() => onSelectCargo(cargo)}
        className={`${styles.cargoItem} ${isSelected ? styles.selected : ''} ${styles[statusKey] ?? ''}`}
        style={{ margin: '2px 0' }}
      >
        <span className={styles.cargoName}>{cargo.name}</span>
        <span className={styles.cargoDetails}>
          {getStatusText(cargo.status)} · {cargo.speed.toFixed(1)} км/ч
        </span>
      </div>
    </div>
  );
}, (prev, next) => {
  const prevCargo = prev.cargoes[prev.index];
  const nextCargo = next.cargoes[next.index];
  return (
    prevCargo === nextCargo &&
    prev.index === next.index &&
    prev.selectedCargoId === next.selectedCargoId &&
    prev.style === next.style
  );
}) as React.MemoExoticComponent<(props: CargoRowProps) => React.ReactElement>;

CargoRow.displayName = 'CargoRow';

interface VirtualizedCargoListProps {
  cargoes: Cargo[];
  selectedCargoId: string | null;
  onSelectCargo: (cargo: Cargo) => void;
  height?: number;
}

const VirtualizedCargoList: React.FC<VirtualizedCargoListProps> = ({
  cargoes,
  selectedCargoId,
  onSelectCargo,
  height,
}) => {
  const itemHeight = 58;
  const listHeight = height ?? Math.min(cargoes.length * itemHeight, 600);

  return (
    <div className={styles.cargoList}>
      <h3>Грузы ({cargoes.length})</h3>
      <List
        rowComponent={CargoRow as any}
        rowCount={cargoes.length}
        rowHeight={itemHeight}
        rowProps={{
          cargoes,
          selectedCargoId,
          onSelectCargo,
        }}
        style={{ height: listHeight, overflow: 'auto' }}
        overscanCount={5}
      />
    </div>
  );
};

export default VirtualizedCargoList;
