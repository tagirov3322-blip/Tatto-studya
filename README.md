# Tatto Studya

Сайт для тату-студии.

## Структура

```
frontend/   — Next.js (TypeScript, Tailwind CSS)
backend/    — Express + Prisma + PostgreSQL
```

## Запуск

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### Backend
```bash
cd backend
npm install
# Настрой .env (скопируй из .env.example)
npm run db:migrate
npm run dev
# → http://localhost:4000
```

## API эндпоинты

| Метод | URL | Описание |
|-------|-----|----------|
| GET | /api/health | Проверка работоспособности |
| GET | /api/artists | Все мастера |
| GET | /api/artists/:id | Мастер по ID |
| GET | /api/portfolio | Портфолио (фильтр: ?style=...&artistId=...) |
| POST | /api/bookings | Создать запись на сеанс |
| GET | /api/bookings | Все записи (админка) |
