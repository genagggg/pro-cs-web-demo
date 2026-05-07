const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const MOSCOW_CENTER = { lat: 55.7558, lng: 37.6173 };
const RADIUS = 0.5;

const generateCargoes = () => {
  const cargoes = [];
  const cargoNames = [
    'Товары для магазина', 'Строительные материалы', 'Оборудование для офиса',
    'Продукты питания', 'Электроника', 'Одежда и обувь', 'Мебель', 'Книги',
    'Игрушки', 'Химические товары', 'Автозапчасти', 'Спортивный инвентарь',
    'Медицинские товары', 'Бытовая техника', 'Ювелирные изделия',
    'Музыкальные инструменты', 'Садовая техника', 'Канцелярия', 'Посуда',
  ];
  const statuses = ['moving', 'stopped', 'delivered', 'pending'];
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * 2 * Math.PI;
    const lat = MOSCOW_CENTER.lat + RADIUS * Math.cos(angle) * (0.7 + Math.random() * 0.6);
    const lng = MOSCOW_CENTER.lng + RADIUS * Math.sin(angle) * (0.7 + Math.random() * 0.6);
    cargoes.push({
      id: `cargo-${i + 1}`,
      lat: parseFloat(lat.toFixed(6)),
      lng: parseFloat(lng.toFixed(6)),
      name: cargoNames[i] || `Груз #${i + 1}`,
      status: statuses[i % statuses.length],
      speed: Math.random() * 80 + 20,
    });
  }
  return cargoes;
};

let cargoes = generateCargoes();

const mockVehicles = [
  { id: 1, name: 'Truck-001', type: 'Heavy', location: { lat: 55.7558, lng: 37.6173 }, status: 'active' },
  { id: 2, name: 'Van-002', type: 'Medium', location: { lat: 55.75, lng: 37.6 }, status: 'active' },
  { id: 3, name: 'Truck-003', type: 'Heavy', location: { lat: 55.76, lng: 37.63 }, status: 'inactive' },
];

const mockOffers = [
  { id: 1, client: 'ABC Corp', service: 'Express', price: 1500, status: 'pending' },
  { id: 2, client: 'XYZ Ltd', service: 'Standard', price: 800, status: 'accepted' },
  { id: 3, client: 'Global Inc', service: 'Bulk', price: 3500, status: 'pending' },
];

app.get('/api/vehicles', (req, res) => res.json(mockVehicles));

app.get('/api/offers', (req, res) => res.json(mockOffers));

app.post('/api/offers', (req, res) => {
  const newOffer = { id: mockOffers.length + 1, ...req.body, status: 'pending' };
  mockOffers.push(newOffer);
  res.status(201).json(newOffer);
});

app.get('/api/radar/cargoes', (req, res) => {
  const data = cargoes.map(({ id, lat, lng, name, status, speed }) => ({ id, lat, lng, name, status, speed }));
  res.json(data);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), cargoes: cargoes.length });
});

module.exports = app;
