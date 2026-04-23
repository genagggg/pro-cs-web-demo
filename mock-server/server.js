const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Mock data for logistics
const mockVehicles = [
  { id: 1, name: 'Truck-001', type: 'Heavy', location: { lat: 55.7558, lng: 37.6173 }, status: 'active' },
  { id: 2, name: 'Van-002', type: 'Medium', location: { lat: 55.7500, lng: 37.6000 }, status: 'active' },
  { id: 3, name: 'Truck-003', type: 'Heavy', location: { lat: 55.7600, lng: 37.6300 }, status: 'inactive' },
];

const mockOffers = [
  { id: 1, client: 'ABC Corp', service: 'Express', price: 1500, status: 'pending' },
  { id: 2, client: 'XYZ Ltd', service: 'Standard', price: 800, status: 'accepted' },
  { id: 3, client: 'Global Inc', service: 'Bulk', price: 3500, status: 'pending' },
];

// REST API endpoints
app.get('/api/vehicles', (req, res) => {
  res.json(mockVehicles);
});

app.get('/api/offers', (req, res) => {
  res.json(mockOffers);
});

app.post('/api/offers', (req, res) => {
  const newOffer = {
    id: mockOffers.length + 1,
    ...req.body,
    status: 'pending'
  };
  mockOffers.push(newOffer);
  res.status(201).json(newOffer);
});

// WebSocket connections
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  // Send initial vehicle positions
  ws.send(JSON.stringify({
    type: 'VEHICLE_UPDATE',
    data: mockVehicles
  }));
  
  // Send periodic updates
  const interval = setInterval(() => {
    // Simulate vehicle movement
    mockVehicles.forEach(vehicle => {
      if (vehicle.status === 'active') {
        vehicle.location.lat += (Math.random() - 0.5) * 0.001;
        vehicle.location.lng += (Math.random() - 0.5) * 0.001;
      }
    });
    
    ws.send(JSON.stringify({
      type: 'VEHICLE_UPDATE',
      data: mockVehicles
    }));
  }, 3000);
  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
    clearInterval(interval);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
  console.log(`REST API: http://localhost:${PORT}/api/vehicles`);
  console.log(`WebSocket: ws://localhost:${PORT}`);
});