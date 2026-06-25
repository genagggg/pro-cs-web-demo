# Pro CS Web Demo — Enterprise Logistics System

Монорепозиторий на Module Federation для enterprise-системы логистики с WebSocket-обновлениями в реальном времени.

---

## Архитектура

### Микрофронтенды (Webpack 5 Module Federation)

```
┌──────────────────────────────────────────────────┐
│                   Host (:3000)                    │
│  ┌─────────────┐  ┌────────────────────────────┐ │
│  │  RadarApp   │  │       OffersApp            │ │
│  │  (remote)   │  │       (remote)             │ │
│  └──────┬──────┘  └───────────┬────────────────┘ │
│         │                     │                   │
│  ┌──────┴─────────────────────┴────────────────┐ │
│  │         Redux Store (Shared)                │ │
│  └─────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
         │                    │
┌────────▼────────┐  ┌────────▼────────┐
│  remote-radar   │  │ remote-offers   │
│  (:3001)        │  │ (:3002)         │
│  Leaflet Map    │  │ React Forms     │
│  WebSocket      │  │ DnD Table       │
└────────┬────────┘  └────────┬────────┘
         │                    │
         └────────┬───────────┘
                  ▼
       ┌──────────────────┐
       │   Mock Server    │
       │   (:3003)        │
       │ Express + WS     │
       │ + Static Serve   │
       └──────────────────┘
```

### WebSocket

- Mock-сервер отправляет обновления позиций грузов через WebSocket (`ws://localhost:3003`)
- Remote-radar подписывается и обновляет маркеры на карте Leaflet в реальном времени
- Частота обновления: каждые 2 секунды

---

## Быстрый старт

### Требования

- Node.js >= 18
- npm >= 9

### Установка и dev-запуск

```bash
git clone <repo-url>
cd pro-cs-web-demo
npm install
npm run dev
```

| Модуль        | URL                                  |
| ------------- | ------------------------------------ |
| Host          | http://localhost:3000                |
| Remote Radar  | http://localhost:3001                |
| Remote Offers | http://localhost:3002                |
| Mock Server   | http://localhost:3003                |

### Production сборка и запуск

```bash
npm run build:prod
npm run start
```

Приложение доступно на **http://localhost:3003** — всё на одном порту:
- Фронт
- REST API (`/api/radar/cargoes`, `/api/vehicles`, `/api/offers`)
- WebSocket
- Health check (`/health`)

---

## Команды

| Команда            | Описание                           |
| ------------------ | ---------------------------------- |
| `npm run dev`      | Запуск всех модулей в dev-режиме   |
| `npm run dev:host` | Только host                        |
| `npm run dev:radar`| Только radar                       |
| `npm run dev:offers`| Только offers                     |
| `npm run dev:mock` | Только mock-сервер                 |
| `npm run build`    | Dev-сборка всех модулей            |
| `npm run build:prod` | Production сборка                |
| `npm run start`    | Запуск production сервера          |
| `npm run lint`     | ESLint                             |
| `npm run type-check` | TypeScript проверка              |
| `npm run format`   | Prettier                           |

---

## Docker (планируется)

```dockerfile
# Пример Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build:prod
EXPOSE 3003
CMD ["node", "mock-server/server.js"]
```

```yaml
# Пример docker-compose.yml
services:
  app:
    build: .
    ports:
      - "3003:3003"
```

---

## Структура проекта

```
pro-cs-web-demo/
├── host/                    # Главное приложение
│   ├── src/
│   │   ├── App.tsx          # lazy loading remote'ов
│   │   └── index.tsx
│   ├── public/
│   │   └── index.html
│   ├── webpack.config.js
│   └── package.json
├── remote-radar/            # Микрофронтенд карты
│   ├── src/
│   │   ├── bootstrap.tsx
│   │   ├── RadarApp.tsx
│   │   └── hooks/useWebSocket.ts
│   ├── webpack.config.js
│   └── package.json
├── remote-offers/           # Микрофронтенд заявок
│   ├── src/
│   │   ├── bootstrap.tsx
│   │   └── OffersApp.tsx
│   ├── webpack.config.js
│   └── package.json
├── mock-server/             # Express + WebSocket сервер
│   ├── server.js
│   └── package.json
├── types/                   # Общие типы TypeScript
├── tsconfig.json
├── package.json             # Корневой (npm workspaces)
└── README.md
```

---

## Технологии

- **React 18** + TypeScript (strict mode)
- **Webpack 5** + Module Federation
- **Redux Toolkit** + RTK Query
- **npm workspaces** (монорепозиторий)
- **Leaflet** + react-leaflet (карты)
- **react-hook-form** + Zod (формы)
- **@dnd-kit** (drag & drop)
- **@tanstack/react-table** (таблицы)
- **Express** + **ws** (WebSocket сервер)

---

## Планы по деплою

- [x] Локальный запуск: `npm run build:prod && npm run start`
- [ ] Docker: `Dockerfile` + `docker-compose.yml`
- [ ] Хостинг: Render / Railway / VPS
