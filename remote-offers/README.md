# Remote Offers

Микрофронтенд модуля заявок на перевозку грузов. Подключается к host через Webpack Module Federation.

## Стек

- React 18 + TypeScript
- React Hook Form + Zod (валидация форм)
- Webpack 5 + Module Federation
- Порт: 3002

## Запуск

```bash
npm install
npm run dev
```

Модуль доступен на http://localhost:3002, remoteEntry — http://localhost:3002/remoteEntry.js

## Сборка

```bash
npm run build
```

## Структура

```
src/
├── bootstrap.tsx          # Точка входа (standalone-запуск)
├── OffersApp.tsx          # Корневой компонент модуля (экспортируется в MF)
└── components/
    └── OfferForm.tsx      # Форма создания заявки
```

## OfferForm

Форма на React Hook Form + zodResolver со следующими полями:

| Поле | Тип | Валидация |
|---|---|---|
| Тип груза | select | Обязательное |
| Вес | number | > 0 |
| Дата доставки | date | Не раньше завтрашнего дня |
| Адрес | text | Минимум 5 символов |
| Контрагент | text | Минимум 2 символа |
| Требуется спецтехника | checkbox | Показывается только при весе > 100 кг |

При успешной отправке — alert с данными формы.

## Module Federation

Модуль экспортирует:

```js
// host/webpack.config.js
remotes: {
  offers: 'offers@http://localhost:3002/remoteEntry.js'
}
```

```tsx
// Импорт в host
const OffersApp = lazy(() => import('offers/OffersApp'));
```
