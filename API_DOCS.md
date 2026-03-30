# API документация для фронтенда

**Базовый URL:** `http://localhost:4000`

---

## Авторизация

### POST `/api/auth/login`
Логин админа. Возвращает JWT токен на 24 часа.

**Body:**
```json
{
  "login": "admin",
  "password": "tattostud2026"
}
```

**Ответ:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Как использовать токен:**
Добавляй заголовок ко всем защищённым запросам:
```
Authorization: Bearer <token>
```

---

## Мастера (Artists)

### GET `/api/artists` — получить всех мастеров (публичный)
**Ответ:**
```json
[
  {
    "id": "uuid",
    "name": "Иван",
    "bio": "Мастер реализма",
    "photoUrl": null,
    "styles": ["реализм", "графика"],
    "createdAt": "2026-03-30T13:36:26.124Z",
    "updatedAt": "2026-03-30T13:36:26.124Z",
    "portfolioItems": []
  }
]
```

### GET `/api/artists/:id` — получить мастера по ID (публичный)

### POST `/api/artists` — создать мастера (🔒 требует токен)
**Body:**
```json
{
  "name": "Имя",
  "bio": "Описание",
  "photoUrl": "https://...",
  "styles": ["реализм", "графика"]
}
```

### PUT `/api/artists/:id` — обновить мастера (🔒 требует токен)
**Body:** любые поля из POST (только те что меняешь)

### DELETE `/api/artists/:id` — удалить мастера (🔒 требует токен)

---

## Заявки (Bookings)

### POST `/api/bookings` — создать заявку (публичный)
Используется на странице записи. Клиент заполняет форму — данные отправляются сюда.

**Body:**
```json
{
  "name": "Имя клиента",
  "phone": "+7 999 123 45 67",
  "email": "client@mail.ru",
  "message": "Хочу тату дракона",
  "date": "2026-04-15T14:00:00Z",
  "artistId": "uuid мастера"
}
```
Обязательные поля: `name`, `phone`, `date`, `artistId`

**Ответ:** созданная заявка со статусом `PENDING`

### GET `/api/bookings` — все заявки (🔒 требует токен)
Для админ-панели. Возвращает заявки с информацией о мастере.

### PUT `/api/bookings/:id` — изменить статус заявки (🔒 требует токен)
**Body:**
```json
{
  "status": "CONFIRMED"
}
```
Возможные статусы: `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`

### DELETE `/api/bookings/:id` — удалить заявку (🔒 требует токен)

---

## Услуги (Services)

### GET `/api/services` — все услуги (публичный)
**Ответ:**
```json
[
  {
    "id": "uuid",
    "name": "Тату до 10 см",
    "description": "Небольшая татуировка",
    "price": 5000,
    "imageUrl": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

### POST `/api/services` — создать услугу (🔒 требует токен)
**Body:**
```json
{
  "name": "Тату до 10 см",
  "description": "Небольшая татуировка",
  "price": 5000,
  "imageUrl": "https://..."
}
```
Обязательные поля: `name`, `price`

### PUT `/api/services/:id` — обновить услугу (🔒 требует токен)

### DELETE `/api/services/:id` — удалить услугу (🔒 требует токен)

---

## Портфолио (Portfolio)

### GET `/api/portfolio` — все работы (публичный)
Поддерживает фильтры: `?style=реализм` или `?artistId=uuid`

---

## Уведомления (Realtime)

### GET `/api/notifications/bookings` — SSE-стрим новых заявок
Подключение через EventSource на фронтенде:

```javascript
const events = new EventSource("http://localhost:4000/api/notifications/bookings");

events.onmessage = (event) => {
  const booking = JSON.parse(event.data);
  // Показать уведомление о новой заявке
  console.log("Новая заявка:", booking);
};
```

---

## Проверка сервера

### GET `/api/health`
**Ответ:** `{ "status": "ok" }`

---

## Страницы которые нужны на фронтенде

### Публичные:
- **Главная** — информация о студии
- **Мастера** — `GET /api/artists`
- **Портфолио** — `GET /api/portfolio`
- **Услуги и цены** — `GET /api/services`
- **Запись** — форма → `POST /api/bookings`

### Админка (за логином):
- **Логин** `/admin/login` → `POST /api/auth/login`
- **Заявки** `/admin/bookings` → `GET /api/bookings` + кнопки статусов
- **Мастера** `/admin/artists` → CRUD
- **Услуги** `/admin/services` → CRUD
- **Уведомления** → SSE `/api/notifications/bookings`

Токен хранить в `localStorage`. При 401 ответе — редирект на логин.
