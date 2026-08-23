# Мясной Пул Таврическое

Сервис предзаказа фермерской говядины: публичный лендинг, бронирование коробок, Telegram-уведомления и CRM фермера.

## Локальный запуск

Требования: Node.js 22+, PostgreSQL.

```bash
npm install
copy .env.example .env.local
npm run db:migrate
npm run dev
```

После первого запуска откройте `/admin/login`, войдите и создайте первый пул.

## Переменные окружения

- `DATABASE_URL` — строка подключения PostgreSQL.
- `AUTH_SECRET` — случайная строка от 32 символов для подписи сессии.
- `ADMIN_PASSWORD` — пароль CRM.
- `TELEGRAM_BOT_TOKEN` — токен Telegram-бота, необязательно.
- `TELEGRAM_CHAT_ID` — ID получателя уведомлений, необязательно.

## Команды

```bash
npm run dev          # режим разработки
npm run build        # production-сборка
npm run lint         # ESLint
npm run typecheck    # проверка TypeScript
npm run db:generate  # создать миграцию после изменения схемы
npm run db:migrate   # применить миграции
```

## Railway

1. Создайте проект из GitHub-репозитория.
2. Добавьте PostgreSQL-сервис.
3. Добавьте `AUTH_SECRET`, `ADMIN_PASSWORD`, `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`.
4. Railway автоматически выполнит сборку, миграции и запуск по `railway.json`.
