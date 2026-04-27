import { Cargo } from './types';

const MOSCOW_CENTER = { lat: 55.7558, lng: 37.6173 };
const SPREAD = 0.15;
const STATUSES: Cargo['status'][] = ['moving', 'stopped', 'delivered', 'pending'];

const generateEmulatedCargoes = (count: number): Cargo[] => {
  const cargoes: Cargo[] = [];
  for (let i = 0; i < count; i++) {
    const status = STATUSES[i % STATUSES.length];
    cargoes.push({
      id: `emu-${i}`,
      lat: MOSCOW_CENTER.lat + (Math.random() - 0.5) * SPREAD * 2,
      lng: MOSCOW_CENTER.lng + (Math.random() - 0.5) * SPREAD * 2,
      name: `Груз-${String(i + 1).padStart(3, '0')}`,
      status,
      speed: status === 'moving' ? 30 + Math.random() * 70 : 0,
    });
  }
  return cargoes;
};

export default generateEmulatedCargoes;
