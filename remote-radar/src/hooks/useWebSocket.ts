import { useEffect, useRef, useCallback } from 'react';
import { Cargo, WsStatus } from '../types';

const WS_URL = process.env.WS_URL || 'ws://localhost:3003';
const API_URL = process.env.API_URL || 'http://localhost:3003/api/radar/cargoes';
const RECONNECT_DELAY = 3000;
const POLL_INTERVAL = 5000;

interface UseWebSocketOptions {
  onMessage: (data: Cargo[]) => void;
  onStatusChange: (status: WsStatus) => void;
}

const isValidCargo = (item: any): item is Cargo =>
  item &&
  typeof item.id === 'string' &&
  typeof item.lat === 'number' &&
  typeof item.lng === 'number' &&
  typeof item.name === 'string' &&
  typeof item.status === 'string' &&
  typeof item.speed === 'number';

const useWebSocket = ({ onMessage, onStatusChange }: UseWebSocketOptions) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number>();
  const pollTimerRef = useRef<number>();
  const onMessageRef = useRef(onMessage);
  const onStatusChangeRef = useRef(onStatusChange);

  onMessageRef.current = onMessage;
  onStatusChangeRef.current = onStatusChange;

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = undefined;
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();

    const fetchCargoes = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) {
          const valid = data.filter(isValidCargo);
          if (valid.length > 0) {
            onMessageRef.current(valid);
          }
        }
      } catch {
        // silent — сервер недоступен
      }
    };

    fetchCargoes();
    pollTimerRef.current = window.setInterval(fetchCargoes, POLL_INTERVAL);
  }, [stopPolling]);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket подключен');
        onStatusChangeRef.current('connected');
        stopPolling();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (Array.isArray(data)) {
            const valid = data.filter(isValidCargo);
            if (valid.length > 0) {
              onMessageRef.current(valid);
            }
          }
        } catch (error) {
          console.error('Ошибка парсинга данных WebSocket:', error);
        }
      };

      ws.onerror = () => {
        onStatusChangeRef.current('disconnected');
      };

      ws.onclose = () => {
        console.log('WebSocket отключен');
        onStatusChangeRef.current('disconnected');
        startPolling();

        reconnectTimerRef.current = window.setTimeout(() => {
          console.log('Попытка переподключения...');
          connect();
        }, RECONNECT_DELAY);
      };
    } catch (error) {
      console.error('Ошибка создания WebSocket:', error);
      onStatusChangeRef.current('disconnected');
      startPolling();
    }
  }, [stopPolling, startPolling]);

  useEffect(() => {
    onStatusChangeRef.current('connecting');
    connect();

    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      stopPolling();
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect, stopPolling]);
};

export default useWebSocket;
