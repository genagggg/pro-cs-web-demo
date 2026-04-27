import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import { Cargo } from '../types';

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

interface MemoizedCargoMarkerProps {
  id: string;
  lat: number;
  lng: number;
  name: string;
  status: Cargo['status'];
  speed: number;
  onClick: (id: string) => void;
}

const MemoizedCargoMarker: React.FC<MemoizedCargoMarkerProps> = React.memo(
  ({ id, lat, lng, name, status, speed, onClick }) => {
    return (
      <Marker
        position={[lat, lng] as LatLngTuple}
        icon={STATUS_ICONS[status]}
        eventHandlers={{
          click: () => onClick(id),
        }}
      >
        <Popup>
          <div style={{ minWidth: '200px' }}>
            <h4 style={{ margin: '0 0 8px 0' }}>{name}</h4>
            <p style={{ margin: '4px 0' }}><strong>ID:</strong> {id}</p>
            <p style={{ margin: '4px 0' }}><strong>Статус:</strong> {getStatusText(status)}</p>
            <p style={{ margin: '4px 0' }}><strong>Скорость:</strong> {speed.toFixed(1)} км/ч</p>
            <p style={{ margin: '4px 0' }}>
              <strong>Координаты:</strong> {lat.toFixed(4)}, {lng.toFixed(4)}
            </p>
          </div>
        </Popup>
      </Marker>
    );
  },
  (prev, next) => {
    return (
      prev.id === next.id &&
      prev.lat === next.lat &&
      prev.lng === next.lng
    );
  }
);

MemoizedCargoMarker.displayName = 'MemoizedCargoMarker';

export default MemoizedCargoMarker;
