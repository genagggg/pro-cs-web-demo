import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import useWebSocket from '../hooks/useWebSocket';
import useThrottle from '../hooks/useThrottle';
import { Cargo, WsStatus } from '../types';
import MemoizedCargoMarker from './MemoizedCargoMarker';
import VirtualizedCargoList from './VirtualizedCargoList';
import FPSDisplay from './FPSDisplay';
import generateEmulatedCargoes from '../generateEmulatedCargoes';
import * as stylesRaw from '../styles/radar.module.css';
const styles = stylesRaw.default && typeof stylesRaw.default === 'object' ? stylesRaw.default : stylesRaw as any;
import '../styles/leaflet-overrides.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapComponentProps {
  throttlingInterval?: number;
}

const MapResizeHandler: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    const invalidate = () => {
      try {
        map.invalidateSize();
      } catch (error) {
        console.warn('Error invalidating map size:', error);
      }
    };

    const timers = [100, 300, 700, 1500].map(
      delay => setTimeout(invalidate, delay)
    );

    const container = map.getContainer();
    let rafId: number;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(invalidate);
    });
    
    if (container) {
      ro.observe(container);
    }

    invalidate();

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [map]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ throttlingInterval = 500 }) => {
  const [cargoes, setCargoes] = useState<Cargo[]>([]);
  const [selectedCargoId, setSelectedCargoId] = useState<string | null>(null);
  const [wsStatus, setWsStatus] = useState<WsStatus>('connecting');
  const [mapReady, setMapReady] = useState(false);
  const [mobileListOpen, setMobileListOpen] = useState(false);
  const [tileError, setTileError] = useState(false);
  const initialCargoesSet = useRef(false);

  const throttledUpdateCargoes = useThrottle((newCargoes: Cargo[]) => {
    setCargoes(prevCargoes => {
      if (!initialCargoesSet.current) {
        initialCargoesSet.current = true;
        return newCargoes;
      }

      return prevCargoes.map(prevCargo => {
        const newCargo = newCargoes.find(c => c.id === prevCargo.id);
        if (newCargo) {
          const latChanged = Math.abs(newCargo.lat - prevCargo.lat) > 0.0001;
          const lngChanged = Math.abs(newCargo.lng - prevCargo.lng) > 0.0001;
          const statusChanged = newCargo.status !== prevCargo.status;
          const speedChanged = Math.abs(newCargo.speed - prevCargo.speed) > 0.1;

          if (latChanged || lngChanged || statusChanged || speedChanged) {
            return newCargo;
          }
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

  const handleMarkerClick = useCallback((id: string) => {
    setSelectedCargoId(id);
  }, []);

  const handleSelectCargo = useCallback((cargo: Cargo) => {
    setSelectedCargoId(cargo.id);
    setMobileListOpen(false);
  }, []);

  const handleEmulate500 = useCallback(() => {
    const emulated = generateEmulatedCargoes(500);
    setCargoes(emulated);
    initialCargoesSet.current = true;
  }, []);

  const moscowCenter: LatLngTuple = [55.7558, 37.6173];

  useEffect(() => {
    const timer = setTimeout(() => {
      setMapReady(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mapReady) return;
    
    const resizeTimer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
    
    return () => clearTimeout(resizeTimer);
  }, [mapReady]);

  return (
    <div className={styles.radarContainer}>
      <FPSDisplay />

      <div className={styles.statusIndicator}>
        <div className={`${styles.statusDot} ${wsStatus}`} />
        <span className={styles.statusText}>
          {wsStatus === 'connected' ? 'Подключено' :
           wsStatus === 'connecting' ? 'Подключение...' : 'Отключено'}
        </span>
      </div>

      <button
        className={styles.emulateBtn}
        onClick={handleEmulate500}
      >
        Эмулировать 500 грузов
      </button>

      <button
        className={styles.mobileListBtn}
        onClick={() => setMobileListOpen(prev => !prev)}
      >
        {mobileListOpen ? '✕' : `Грузы (${cargoes.length})`}
      </button>

      {mapReady ? (
        <MapContainer
          center={moscowCenter}
          zoom={11}
          className="leaflet-container"
        >
          <MapResizeHandler />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
            minZoom={1}
            eventHandlers={{
              error: () => {
                console.warn('OpenStreetMap tiles failed to load');
                setTileError(true);
              }
            }}
          />
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            maxZoom={20}
            minZoom={1}
            className="fallback-tile"
            eventHandlers={{
              load: () => {
                if (tileError) {
                  console.log('Fallback tiles loaded successfully');
                }
              }
            }}
          />
          {cargoes.map(cargo => (
            <MemoizedCargoMarker
              key={cargo.id}
              id={cargo.id}
              lat={cargo.lat}
              lng={cargo.lng}
              name={cargo.name}
              status={cargo.status}
              speed={cargo.speed}
              onClick={handleMarkerClick}
            />
          ))}
        </MapContainer>
      ) : (
        <div className="leaflet-container" style={{
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

      <div className={`${styles.cargoPanel} ${mobileListOpen ? styles.mobileOpen : ''}`}>
        <VirtualizedCargoList
          cargoes={cargoes}
          selectedCargoId={selectedCargoId}
          onSelectCargo={handleSelectCargo}
        />
      </div>
    </div>
  );
};

export default MapComponent;
