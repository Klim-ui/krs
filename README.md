# Мясной Пул Таврическое

Сервис предзаказа фермерской говядины: публичный лендинг, бронирование четвертей туши, MAX-уведомления и CRM фермера.

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
- `MAX_BOT_TOKEN` — токен MAX-бота после модерации, необязательно.
- `MAX_USER_ID` — ID пользователя для личных уведомлений из `bot_started`.
- `MAX_CHAT_ID` — альтернативный ID группового чата; `MAX_USER_ID` приоритетнее.

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
3. Добавьте `AUTH_SECRET`, `ADMIN_PASSWORD`, а после модерации бота — `MAX_BOT_TOKEN` и `MAX_USER_ID`.
4. Railway автоматически выполнит сборку, миграции и запуск по `railway.json`.
