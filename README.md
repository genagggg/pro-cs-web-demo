# Pro CS Web Demo - Enterprise Logistics System

Монорепозиторий на основе Module Federation для enterprise-системы логистики.

## Структура проекта

```
pro-cs-web-demo/
├── host/                    # Главное приложение (порт 3000)
│   ├── src/
│   │   ├── App.tsx         # Основной компонент с lazy loading
│   │   └── index.tsx       # Точка входа
│   ├── public/
│   │   └── index.html
│   ├── webpack.config.js   # Конфигурация Webpack для host
│   └── package.json
├── remote-radar/           # Микрофронтенд карты (порт 3001)
│   ├── src/
│   │   ├── bootstrap.tsx   # Точка входа remote модуля
│   │   └── RadarApp.tsx    # Компонент карты
│   ├── public/
│   │   └── index.html
│   ├── webpack.config.js   # Конфигурация Webpack для remote
│   └── package.json
├── remote-offers/          # Микрофронтенд форм (порт 3002)
│   ├── src/
│   │   ├── bootstrap.tsx
│   │   └── OffersApp.tsx   # Компонент форм
│   ├── public/
│   │   └── index.html
│   ├── webpack.config.js
│   └── package.json
├── mock-server/            # Mock сервер (порт 3003)
│   ├── server.js          # Express + WebSocket сервер
│   └── package.json
├── tsconfig.json          # Общая конфигурация TypeScript
├── webpack.config.template.js # Шаблон конфигурации Webpack
└── package.json           # Корневой package.json с workspaces
```

## Технологии

- **React 18** с TypeScript (strict mode)
- **Webpack 5 + Module Federation** для микрофронтендов
- **Redux Toolkit + RTK Query** для управления состоянием
- **npm workspaces** для монорепозитория
- **Express + WebSocket** для mock сервера

## Установка и запуск

### 1. Установка зависимостей

```bash
# В корне проекта
npm install
```

### 2. Запуск всех приложений одновременно

```bash
# Запустит все 4 приложения параллельно
npm run dev
```

### 3. Запуск отдельных модулей

```bash
# Только host приложение
npm run dev:host

# Только radar микрофронтенд
npm run dev:radar

# Только offers микрофронтенд
npm run dev:offers

# Только mock сервер
npm run dev:mock
```

## Порты приложений

- **Host Application**: http://localhost:3000
- **Radar Micro-frontend**: http://localhost:3001
- **Offers Micro-frontend**: http://localhost:3002
- **Mock Server API**: http://localhost:3003

## API эндпоинты

Mock сервер предоставляет следующие эндпоинты:

- `GET /api/vehicles` - список транспортных средств
- `GET /api/offers` - список предложений
- `POST /api/offers` - создание нового предложения
- `GET /health` - проверка здоровья сервера
- `WebSocket ws://localhost:3003` - реальные обновления позиций транспорта

## Сборка для production

```bash
# Собрать все модули
npm run build

# Очистить node_modules
npm run clean
```

## Основные скрипты

- `npm run dev` - запуск всех приложений в режиме разработки
- `npm run build` - сборка всех модулей
- `npm run clean` - очистка зависимостей

## Архитектура Module Federation

### Host (главное приложение)
- Загружает remote модули через `React.lazy()`
- Определяет общие зависимости (React, Redux)
- Координирует работу микрофронтендов

### Remote модули
- Самостоятельные приложения со своими сборками
- Экспортируют компоненты через Module Federation
- Могут работать независимо или внутри host

### Общие зависимости
- React, ReactDOM, Redux Toolkit разделяются между всеми модулями
- Предотвращают дублирование кода в браузере

## Разработка

1. Каждый модуль разрабатывается независимо
2. Изменения в remote модулях автоматически подхватываются host
3. Mock сервер предоставляет реалистичные данные для разработки
4. TypeScript strict mode обеспечивает типобезопасность

## Управление версиями с Git

Проект использует Git для управления версиями. Основные команды:

### Работа с репозиторием
```bash
# Проверить статус изменений
git status

# Просмотр истории коммитов
git log --oneline --graph

# Добавить изменения
git add .

# Создать коммит
git commit -m "Описание изменений"

# Отправить изменения в удаленный репозиторий
git push

# Получить изменения из удаленного репозитория
git pull
```

### Ветвление
```bash
# Создать новую ветку
git checkout -b feature/new-feature

# Переключиться на существующую ветку
git checkout main

# Слить ветку в текущую
git merge feature/new-feature

# Удалить локальную ветку
git branch -d feature/new-feature
```

### .gitignore
Проект включает `.gitignore` файл который исключает:
- `node_modules/` - зависимости
- файлы сборки и логи
- конфигурационные файлы с чувствительными данными
- временные файлы IDE

## Примечания

- Все модули используют общий `tsconfig.json`
- Webpack конфигурации наследуются от шаблона `webpack.config.template.js`
- Для корректной работы CORS установлены соответствующие заголовки
- Module Federation позволяет независимое развертывание модулей
