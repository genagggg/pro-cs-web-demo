export interface Cargo {
  id: string;
  lat: number;
  lng: number;
  name: string;
  status: 'moving' | 'stopped' | 'delivered' | 'pending';
  speed: number;
}

export type WsStatus = 'connecting' | 'connected' | 'disconnected';
