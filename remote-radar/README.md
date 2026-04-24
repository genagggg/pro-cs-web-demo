# Модуль "Радар" — Remote Radar

Микро-frontend модуль мониторинга грузов в реальном времени на карте Москвы.

## Запуск

```bash
# Терминал 1 — mock-сервер
cd mock-server
npm install
npm start

# Терминал 2 — радар
cd remote-radar
npm install
npm run dev
```

Открыть: http://localhost:3001

## Структура

```
remote-radar/
├── src/
│   ├── components/
│   │   └── MapComponent.tsx      # Карта + маркеры + список грузов
│   ├── hooks/
│   │   ├── useWebSocket.ts       # Хук WebSocket с автопереподключением
│   │   └── useThrottle.ts        # Хук троттлинга
│   ├── styles/
│   │   └── radar.css             # Стили
│   ├── types.ts                  # Типы Cargo, WsStatus
│   ├── RadarApp.tsx              # Главный компонент модуля
│   └── bootstrap.tsx             # Точка входа
├── public/
│   └── index.html
├── webpack.config.js
├── .env                          # WS_URL=ws://localhost:3003
└── package.json
```

## WebSocket протокол

Mock-сервер отправляет массив грузов каждые 2 секунды:

```json
[{ "id": "cargo-1", "lat": 55.7558, "lng": 37.6173, "name": "Товары", "status": "moving", "speed": 60.5 }]
```

Статусы: `moving` (зелёный), `stopped` (красный), `delivered` (синий), `pending` (оранжевый).

## API mock-сервера

- `ws://localhost:3003` — WebSocket реального времени
- `GET http://localhost:3003/api/radar/cargoes` — REST список грузов
- `GET http://localhost:3003/health` — состояние сервера

## Настройка

| Параметр | Где | По умолчанию |
|----------|-----|--------------|
| WebSocket URL | `.env` → `WS_URL` | `ws://localhost:3003` |
| Интервал троттлинга | `<MapComponent throttlingInterval={500} />` | 500 мс |
| Центр карты | `MapComponent.tsx` → `moscowCenter` | [55.7558, 37.6173] |
| Кол-во грузов | `mock-server/server.js` | 20 |

## Отладка

```bash
curl http://localhost:3003/health
npx wscat -c ws://localhost:3003
```

## Интеграция

Модуль использует Webpack Module Federation и экспортирует `RadarApp` через `remoteEntry.js` на порту 3001.
