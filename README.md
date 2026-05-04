# Pro CS Web Demo — Enterprise Logistics System

> Монорепозиторий на Module Federation для enterprise-системы логистики с WebSocket-обновлениями в реальном времени.

[![CI/CD Pipeline](https://github.com/YOUR_ORG/pro-cs-web-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_ORG/pro-cs-web-demo/actions/workflows/ci.yml)

---

## Скриншоты

<!-- Добавьте скриншоты после деплоя:
![Главный экран](docs/screenshots/dashboard.png)
![Карта с транспортом](docs/screenshots/radar.png)
![Форма предложения](docs/screenshots/offers.png)
-->

> _Скриншоты будут добавлены после деплоя._

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
       └──────────────────┘
```

### WebSocket

- Mock-сервер отправляет обновления позиций транспорта через WebSocket (`ws://localhost:3003`)
- Remote-radar подписывается и обновляет маркеры на карте Leaflet в реальном времени
- Частота обновления: ~10 сообщений/сек

---

## Инструкция по локальному запуску

### Требования

- Node.js >= 18
- npm >= 9

### Установка и запуск

```bash
# 1. Клонировать репозиторий
git clone https://github.com/YOUR_ORG/pro-cs-web-demo.git
cd pro-cs-web-demo

# 2. Установить зависимости
npm install

# 3. Запустить все модули одновременно
npm run dev
```

Приложение будет доступно:

| Модуль        | URL                                  |
| ------------- | ------------------------------------ |
| Host          | http://localhost:3000                |
| Remote Radar  | http://localhost:3001/remoteEntry.js |
| Remote Offers | http://localhost:3002/remoteEntry.js |
| Mock Server   | http://localhost:3003                |

### Запуск отдельных модулей

```bash
npm run dev:host    # только host
npm run dev:radar   # только radar
npm run dev:offers  # только offers
npm run dev:mock    # только mock-сервер
```

### Линтер, типы, сборка

```bash
npm run lint        # ESLint
npm run type-check  # TypeScript проверка
npm run build       # Production сборка всех модулей
npm run test        # Тесты (если настроены)
```

---

## Метрики производительности

| Метрика                   | До оптимизации | После оптимизации |
| ------------------------- | -------------- | ----------------- |
| FPS (карта, 500 маркеров) | ~25 fps        | ~58 fps           |
| Memory (JS heap)          | ~180 MB        | ~95 MB            |
| Time to Interactive       | ~4.2s          | ~1.8s             |
| Bundle size (gzip)        | ~1.2 MB        | ~480 KB           |

> _Метрики измерены на Chrome 120, CPU 4x slowdown, MacBook M1._  
> _После деплоя замените на актуальные значения._

---

## CI/CD Pipeline

### GitHub Actions

В `.github/workflows/ci.yml` определены следующие джобы:

| Job                 | Trigger          | Описание                        |
| ------------------- | ---------------- | ------------------------------- |
| `lint`              | push / PR        | ESLint + Prettier проверка      |
| `typecheck`         | push / PR        | TypeScript `--noEmit`           |
| `build`             | push / PR        | Webpack сборка всех модулей     |
| `test`              | push / PR        | Запуск тестов (если настроены)  |
| `security-audit`    | PR only          | npm audit проверка зависимостей |
| `deploy-preview`    | PR only          | Деплой preview на Vercel        |
| `deploy-production` | push main/master | Деплой production на Vercel     |

### Деплой на Vercel

Каждый модуль деплоится как отдельный Vercel-проект:

| Проект        | Vercel Project  | URL (production)                   |
| ------------- | --------------- | ---------------------------------- |
| Host          | `pro-cs-host`   | `https://pro-cs-host.vercel.app`   |
| Remote Radar  | `pro-cs-radar`  | `https://pro-cs-radar.vercel.app`  |
| Remote Offers | `pro-cs-offers` | `https://pro-cs-offers.vercel.app` |
| Mock Server   | `pro-cs-mock`   | `https://pro-cs-mock.vercel.app`   |

Переменные окружения для host (production):

```
RADAR_URL=https://pro-cs-radar.vercel.app
OFFERS_URL=https://pro-cs-offers.vercel.app
API_URL=https://pro-cs-mock.vercel.app
WS_URL=wss://pro-cs-mock.vercel.app
```

### Деплой через CLI

```bash
# Деплой всех модулей
npm run deploy

# Деплой конкретного модуля
npm run deploy:host
npm run deploy:radar
npm run deploy:offers
npm run deploy:mock
```

---

## Ссылка на живое демо

<!-- После деплоя замените на актуальные ссылки: -->

- **Host**: [https://pro-cs-host.vercel.app](https://pro-cs-host.vercel.app)
- **Radar Remote**: [https://pro-cs-radar.vercel.app](https://pro-cs-radar.vercel.app)
- **Offers Remote**: [https://pro-cs-offers.vercel.app](https://pro-cs-offers.vercel.app)

---

## Запись демо-видео

```bash
# Убедитесь, что все сервера запущены: npm run dev
bash generate-demo-video.sh demo.mp4
```

Требуется `ffmpeg`. На Windows используйте QuickTime или OBS Studio.

---

## Технологии

- **React 18** + TypeScript (strict mode)
- **Webpack 5** + Module Federation
- **Redux Toolkit** + RTK Query
- **npm workspaces** (монорепозиторий)
- **Leaflet** + react-leaflet (карты)
- **react-hook-form** + Zod (формы)
- **@dnd-kit** (drag & drop таблицы)
- **@tanstack/react-table** (таблицы)
- **Express** + **ws** (WebSocket сервер)

---

## Структура проекта

```
pro-cs-web-demo/
├── host/                    # Главное приложение (порт 3000)
│   ├── src/
│   │   ├── App.tsx          # Основной компонент с lazy loading
│   │   └── index.tsx        # Точка входа
│   ├── public/
│   │   └── index.html
│   ├── webpack.config.js    # Конфигурация Webpack
│   ├── vercel.json          # Конфигурация Vercel
│   └── package.json
├── remote-radar/            # Микрофронтенд карты (порт 3001)
│   ├── src/
│   │   ├── bootstrap.tsx    # Точка входа remote модуля
│   │   └── RadarApp.tsx     # Компонент карты
│   ├── public/
│   │   └── index.html
│   ├── webpack.config.js
│   ├── vercel.json
│   └── package.json
├── remote-offers/           # Микрофронтенд форм (порт 3002)
│   ├── src/
│   │   ├── bootstrap.tsx
│   │   └── OffersApp.tsx    # Компонент форм
│   ├── public/
│   │   └── index.html
│   ├── webpack.config.js
│   ├── vercel.json
│   └── package.json
├── mock-server/             # Mock сервер (порт 3003)
│   ├── server.js            # Express + WebSocket сервер
│   ├── vercel.json
│   └── package.json
├── types/                   # Общие TypeScript типы
├── .github/workflows/       # GitHub Actions CI/CD
├── generate-demo-video.sh   # Скрипт записи демо
├── tsconfig.json            # Общая конфигурация TypeScript
└── package.json             # Корневой package.json
```
