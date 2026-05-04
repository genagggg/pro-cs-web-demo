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

// Начальные координаты Москвы
const MOSCOW_CENTER = { lat: 55.7558, lng: 37.6173 };
const RADIUS = 0.5; // 0.5 градуса ≈ 55 км

// Генерация 20 грузов для радара
const generateCargoes = () => {
  const cargoes = [];
  const cargoNames = [
    'Товары для магазина',
    'Строительные материалы',
    'Оборудование для офиса',
    'Продукты питания',
    'Электроника',
    'Одежда и обувь',
    'Мебель',
    'Книги',
    'Игрушки',
    'Химические товары',
    'Автозапчасти',
    'Спортивный инвентарь',
    'Медицинские товары',
    'Бытовая техника',
    'Ювелирные изделия',
    'Музыкальные инструменты',
    'Садовая техника',
    'Канцелярия',
    'Игрушки',
    'Посуда',
  ];

  const statuses = ['moving', 'stopped', 'delivered', 'pending'];

  for (let i = 0; i < 20; i++) {
    // Распределяем грузы по кругу вокруг Москвы
    const angle = (i / 20) * 2 * Math.PI;
    const lat = MOSCOW_CENTER.lat + RADIUS * Math.cos(angle) * (0.7 + Math.random() * 0.6);
    const lng = MOSCOW_CENTER.lng + RADIUS * Math.sin(angle) * (0.7 + Math.random() * 0.6);

    cargoes.push({
      id: `cargo-${i + 1}`,
      lat: parseFloat(lat.toFixed(6)),
      lng: parseFloat(lng.toFixed(6)),
      name: cargoNames[i] || `Груз #${i + 1}`,
      status: statuses[i % statuses.length],
      speed: Math.random() * 80 + 20, // Скорость от 20 до 100 км/ч
      angle: angle, // Начальный угол для движения по окружности
    });
  }

  return cargoes;
};

let cargoes = generateCargoes();

// Функция обновления позиций грузов (движение по окружности)
const updateCargoPositions = () => {
  cargoes = cargoes.map((cargo) => {
    // Увеличиваем угол для движения по окружности (даже для stopped/pending)
    const newAngle = cargo.angle + 0.02;

    // Рассчитываем новую позицию
    const lat = MOSCOW_CENTER.lat + RADIUS * Math.cos(newAngle) * (0.7 + Math.random() * 0.6);
    const lng = MOSCOW_CENTER.lng + RADIUS * Math.sin(newAngle) * (0.7 + Math.random() * 0.6);

    // Случайное изменение скорости
    const speedChange = (Math.random() - 0.5) * 10;
    let newSpeed = Math.max(10, Math.min(120, cargo.speed + speedChange));

    // Для остановленных или доставленных грузов скорость = 0
    if (cargo.status === 'stopped' || cargo.status === 'delivered') {
      newSpeed = 0;
    }

    // Случайное изменение статуса (с небольшой вероятностью)
    let newStatus = cargo.status;
    if (Math.random() < 0.05) {
      const statuses = ['moving', 'stopped', 'delivered', 'pending'];
      newStatus = statuses[Math.floor(Math.random() * statuses.length)];
    }

    return {
      ...cargo,
      lat: parseFloat(lat.toFixed(6)),
      lng: parseFloat(lng.toFixed(6)),
      speed: parseFloat(newSpeed.toFixed(1)),
      status: newStatus,
      angle: newAngle,
    };
  });
};

// Отправка данных всем подключенным клиентам
const broadcastData = () => {
  const data = cargoes.map(({ id, lat, lng, name, status, speed }) => ({
    id,
    lat,
    lng,
    name,
    status,
    speed,
  }));

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// REST API endpoints (сохраним для обратной совместимости)
const mockVehicles = [
  {
    id: 1,
    name: 'Truck-001',
    type: 'Heavy',
    location: { lat: 55.7558, lng: 37.6173 },
    status: 'active',
  },
  { id: 2, name: 'Van-002', type: 'Medium', location: { lat: 55.75, lng: 37.6 }, status: 'active' },
  {
    id: 3,
    name: 'Truck-003',
    type: 'Heavy',
    location: { lat: 55.76, lng: 37.63 },
    status: 'inactive',
  },
];

const mockOffers = [
  { id: 1, client: 'ABC Corp', service: 'Express', price: 1500, status: 'pending' },
  { id: 2, client: 'XYZ Ltd', service: 'Standard', price: 800, status: 'accepted' },
  { id: 3, client: 'Global Inc', service: 'Bulk', price: 3500, status: 'pending' },
];

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
    status: 'pending',
  };
  mockOffers.push(newOffer);
  res.status(201).json(newOffer);
});

// WebSocket connections для радара
wss.on('connection', (ws) => {
  console.log('New WebSocket connection for radar');

  // Отправляем начальные данные сразу после подключения
  const initialData = cargoes.map(({ id, lat, lng, name, status, speed }) => ({
    id,
    lat,
    lng,
    name,
    status,
    speed,
  }));
  ws.send(JSON.stringify(initialData));

  // Обработка сообщений от клиента
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Получено сообщение от клиента:', data);

      // Можно добавить обработку команд от клиента, например:
      if (data.type === 'changeStatus' && data.cargoId) {
        const cargo = cargoes.find((c) => c.id === data.cargoId);
        if (cargo) {
          cargo.status = data.status || cargo.status;
        }
      }
    } catch (error) {
      console.error('Ошибка обработки сообщения:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Обновление позиций и отправка данных каждые 2 секунды
setInterval(() => {
  updateCargoPositions();
  broadcastData();
}, 2000);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    cargoes: cargoes.length,
    connectedClients: wss.clients.size,
  });
});

// Новый endpoint для радара
app.get('/api/radar/cargoes', (req, res) => {
  const data = cargoes.map(({ id, lat, lng, name, status, speed }) => ({
    id,
    lat,
    lng,
    name,
    status,
    speed,
  }));
  res.json(data);
});

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`=== Mock Server for Radar Module ===`);
  console.log(`Port: ${PORT}`);
  console.log(`REST API: http://localhost:${PORT}/api/radar/cargoes`);
  console.log(`WebSocket: ws://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`\nРадар отслеживает ${cargoes.length} грузов вокруг Москвы`);
  console.log(`Обновление координат: каждые 2 секунды`);
  console.log(`====================================\n`);
});
