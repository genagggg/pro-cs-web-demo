import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import useWebSocket from '../hooks/useWebSocket';
import useThrottle from '../hooks/useThrottle';
import { Cargo, WsStatus } from '../types';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const STATUS_ICONS: Record<Cargo['status'], L.Icon> = {
  moving: new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),
  stopped: new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),
  delivered: new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),
  pending: new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),
};

const getStatusText = (status: Cargo['status']): string => {
  switch (status) {
    case 'moving': return 'В движении';
    case 'stopped': return 'Остановлен';
    case 'delivered': return 'Доставлен';
    case 'pending': return 'Ожидает';
    default: return 'Неизвестно';
  }
};

interface CargoMarkersProps {
  cargoes: Cargo[];
  onCargoClick: (cargo: Cargo) => void;
  selectedCargoId: string | null;
}

const CargoMarkers: React.FC<CargoMarkersProps> = React.memo(({ cargoes, onCargoClick }) => {
  return (
    <>
      {cargoes.map(cargo => (
        <Marker
          key={cargo.id}
          position={[cargo.lat, cargo.lng] as LatLngTuple}
          icon={STATUS_ICONS[cargo.status]}
          eventHandlers={{
            click: () => onCargoClick(cargo)
          }}
        >
          <Popup>
            <div style={{ minWidth: '200px' }}>
              <h4 style={{ margin: '0 0 8px 0' }}>{cargo.name}</h4>
              <p style={{ margin: '4px 0' }}><strong>ID:</strong> {cargo.id}</p>
              <p style={{ margin: '4px 0' }}><strong>Статус:</strong> {getStatusText(cargo.status)}</p>
              <p style={{ margin: '4px 0' }}><strong>Скорость:</strong> {cargo.speed.toFixed(1)} км/ч</p>
              <p style={{ margin: '4px 0' }}>
                <strong>Координаты:</strong> {cargo.lat.toFixed(4)}, {cargo.lng.toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
});

interface CargoListProps {
  cargoes: Cargo[];
  selectedCargoId: string | null;
  onSelectCargo: (cargo: Cargo) => void;
}

const CargoList: React.FC<CargoListProps> = ({ cargoes, selectedCargoId, onSelectCargo }) => {
  return (
    <div className="radar-cargo-list">
      <h3>Грузы ({cargoes.length})</h3>
      <ul>
        {cargoes.map(cargo => (
          <li
            key={cargo.id}
            onClick={() => onSelectCargo(cargo)}
            className={`radar-cargo-item ${selectedCargoId === cargo.id ? 'selected' : ''} status-${cargo.status}`}
          >
            <span className="cargo-name">{cargo.name}</span>
            <span className="cargo-details">
              {getStatusText(cargo.status)} · {cargo.speed.toFixed(1)} км/ч
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface MapComponentProps {
  throttlingInterval?: number;
}

const MapComponent: React.FC<MapComponentProps> = ({ throttlingInterval = 500 }) => {
  const [cargoes, setCargoes] = useState<Cargo[]>([]);
  const [selectedCargoId, setSelectedCargoId] = useState<string | null>(null);
  const [wsStatus, setWsStatus] = useState<WsStatus>('connecting');
  const [mapReady, setMapReady] = useState(false);
  const initialCargoesSet = useRef(false);

  const throttledUpdateCargoes = useThrottle((newCargoes: Cargo[]) => {
    setCargoes(prevCargoes => {
      if (!initialCargoesSet.current) {
        initialCargoesSet.current = true;
        return newCargoes;
      }

      return prevCargoes.map(prevCargo => {
        const newCargo = newCargoes.find(c => c.id === prevCargo.id);
        if (newCargo &&
            (newCargo.lat !== prevCargo.lat ||
             newCargo.lng !== prevCargo.lng ||
             newCargo.status !== prevCargo.status ||
             newCargo.speed !== prevCargo.speed)) {
          return newCargo;
        }
        return prevCargo;
      });
    });
  }, throttlingInterval);

  const updateCargoes = useCallback((newCargoes: Cargo[]) => {
    throttledUpdateCargoes(newCargoes);
  }, [throttledUpdateCargoes]);

  useWebSocket({
    onMessage: updateCargoes,
    onStatusChange: setWsStatus,
  });

  const handleCargoClick = useCallback((cargo: Cargo) => {
    setSelectedCargoId(cargo.id);
  }, []);

  const handleSelectCargo = useCallback((cargo: Cargo) => {
    setSelectedCargoId(cargo.id);
  }, []);

  const moscowCenter: LatLngTuple = [55.7558, 37.6173];

  useEffect(() => {
    const timer = setTimeout(() => {
      setMapReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="radar-container">
      <div className="radar-status-indicator">
        <div className={`status-dot ${wsStatus}`} />
        <span className="status-text">
          {wsStatus === 'connected' ? 'Подключено' :
           wsStatus === 'connecting' ? 'Подключение...' : 'Отключено'}
        </span>
      </div>

      {mapReady ? (
        <MapContainer
          center={moscowCenter}
          zoom={11}
          className="leaflet-container"
          style={{ height: '100vh', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <CargoMarkers
            cargoes={cargoes}
            onCargoClick={handleCargoClick}
            selectedCargoId={selectedCargoId}
          />
        </MapContainer>
      ) : (
        <div className="leaflet-container" style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f2f5',
          fontSize: '18px',
          color: '#666'
        }}>
          <div>Загрузка карты...</div>
        </div>
      )}

      <CargoList
        cargoes={cargoes}
        selectedCargoId={selectedCargoId}
        onSelectCargo={handleSelectCargo}
      />
    </div>
  );
};

export default MapComponent;
