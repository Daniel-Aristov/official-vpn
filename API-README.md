# Gateway API

API-gateway Official VPN. Проект находится на этапе проектирования:
часть методов возвращает mock-данные, а интеграции с внешними сервисами еще не
подключены.


Swagger UI: `http://165.232.125.201:8000/docs`

Base URL: `http://165.232.125.201:8000`

## Авторизация

Все защищенные эндпоинты требуют заголовок:

```http
Authorization: Bearer <access_token>
```

Публичные эндпоинты:

- `GET /health`
- `POST /auth/login`
- `POST /auth/otp`
- `POST /auth/refresh`

Важно: текущая авторизация работает в mock-режиме. `POST /auth/login` возвращает
OTP в ответе, а `POST /auth/otp` пока выдает токены без реальной проверки OTP.

## Health Check

### GET `/health`

Проверка доступности API.

Response `200`:

```json
{ "status": "ok" }
```

## Auth

### POST `/auth/login`

Запрашивает OTP для входа по email.

Request:

```json
{ "email": "user@example.com" }
```

Response `200`:

```json
{ "email-otp": 123456 }
```

### POST `/auth/otp`

Обменивает email и OTP на JWT-токены.

Request:

```json
{ "email": "user@example.com", "otp_code": 123456 }
```

Response `200`:

```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "token_type": "bearer"
}
```

### POST `/auth/refresh`

Обновляет пару токенов по refresh token.

Request:

```json
{ "refresh_token": "<jwt>" }
```

Response `200`:

```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "token_type": "bearer"
}
```

## Subscriptions

Все эндпоинты раздела требуют `Authorization: Bearer <access_token>`.

### GET `/subscriptions/pricing`

Возвращает доступные тарифы.

Response `200`:

```json
{
  "pro": {
    "price": 299,
    "hwid": 6,
    "price_per_hwid": 60,
    "currency": "RUB",
    "periods": {
      "one_month": 299,
      "three_months": 799,
      "six_months": 1499,
      "one_year": 2799
    }
  },
  "basic": {
    "price": 99,
    "hwid": 3,
    "price_per_hwid": 60,
    "currency": "RUB",
    "periods": {
      "one_month": 99,
      "three_months": 249,
      "six_months": 449,
      "one_year": 799
    }
  }
}
```

Поля:

- `price`: базовая цена тарифа
- `hwid`: количество HWID-слотов в тарифе
- `price_per_hwid`: цена одного дополнительного HWID-слота
- `currency`: валюта
- `periods`: цены по периодам

### GET `/subscriptions/me`

Возвращает текущую подписку пользователя.

Response `200`:

```json
{
  "subscription_id": "sub_mock_001",
  "subscription_type": "pro",
  "hwid": 6,
  "add_hwid_count": 3,
  "status": "active",
  "expires_at": "2026-07-26T12:00:00Z",
  "auto_renew": true,
  "payment_method": "card"
}
```

Поля:

- `subscription_type`: `pro` или `basic`
- `status`: сейчас mock-значение `active`; финальный список статусов нужно согласовать
- `expires_at`: ISO 8601 date-time
- `payment_method`: строка или `null`

### POST `/subscriptions/create`

Создает подписку или заказ на подписку.

Request:

```json
{
  "subscription_type": "pro",
  "period": "1_month",
  "payment_method": "card",
  "add_hwid": 0
}
```

Поля запроса:

- `subscription_type`: `pro` или `basic`
- `period`: `1_month`, `3_months`, `6_months`, `1_year`
- `payment_method`: строка или `null`
- `add_hwid`: количество дополнительных HWID-слотов

Response `201`:

```json
{
  "order_id": "ord_mock_001",
  "payment_url": "https://payment-gateway.mock/pay/ord_mock_001",
  "subscription_id": "sub_mock_001",
  "expires_at": "2026-07-26T12:00:00Z"
}
```

### PATCH `/sme`

Обновляет подписку.

Request:

```json
{ "subscription_type": "pro" }
```

Response `200`: объект текущей подписки, аналогичный `GET /subscriptions/me`.

Если переход на про невозможен, как в случае неактивной подписки, то вернем `422` ошибку. В такой случае юзеру необходимо перейти к оплате  

## Downloads

Все эндпоинты раздела требуют `Authorization: Bearer <access_token>`.

### GET `/download/link`

Возвращает ссылки на установщики для всех поддерживаемых платформ.

Response `200`:

```json
[
  { "os": "ios", "link": "https://mock.example.com/installer/ios/latest" },
  { "os": "android", "link": "https://mock.example.com/installer/android/latest" },
  { "os": "windows", "link": "https://mock.example.com/installer/windows/latest" },
  { "os": "macos", "link": "https://mock.example.com/installer/macos/latest" }
]
```

### GET `/download/installer?os=windows`

Возвращает ссылку на установщик для конкретной платформы.

Query params:

- `os` required: `ios`, `android`, `windows`, `macos`

Response `200`:

```json
{
  "os": "windows",
  "link": "https://mock.example.com/installer/windows/latest"
}
```

## Payments

Все эндпоинты раздела требуют `Authorization: Bearer <access_token>`.

### GET `/payments/methods`

Возвращает доступные способы оплаты.

Response `200`:

```json
{
  "card": true,
  "sbp": true,
  "crypto": false,
  "wallet": false
}
```

### POST `/payments/create`

Создает платежную ссылку для заказа.

Request:

```json
{
  "order_id": "ord_001",
  "amount": 299,
  "currency": "RUB",
  "description": "Оплата подписки PRO",
  "return_url": "https://example.com/payment/success",
  "cancel_url": "https://example.com/payment/cancel"
}
```

Поля запроса:

- `order_id`: обязательная строка
- `amount`: обязательное число
- `currency`: строка, по умолчанию `RUB`
- `description`: строка или `null`
- `return_url`: обязательная строка
- `cancel_url`: строка или `null`

Response `201`:

```json
{
  "payment_id": "pay_ord_001",
  "order_id": "ord_001",
  "payment_url": "https://payment-gateway.mock/pay/ord_001",
  "status": "pending"
}
```

### GET `/payments/me`

Возвращает историю платежей пользователя.

Query params:

- `page`: integer, default `0`
- `size`: integer, default `20`
- `sort`: string, default `createdAt`
- `status`: string или `null`
- `start_date`: string или `null`
- `end_date`: string или `null`
- `min_amount`: number или `null`
- `max_amount`: number или `null`

Example:

```text
/payments/me?page=0&size=10&sort=-createdAt&status=completed
```

Response `200`:

```json
{
  "transactions": [
    {
      "id": "txn_001",
      "order_id": "ord_001",
      "amount": 299,
      "currency": "RUB",
      "status": "completed",
      "description": "Оплата подписки PRO",
      "payment_method": "card",
      "created_at": "2026-01-01T10:00:00Z"
    }
  ],
  "page": 0,
  "size": 10,
  "total_elements": 3,
  "total_pages": 1,
  "last": true
}
```

### GET `/payments/me/{payment_id}`

Возвращает одну транзакцию/платеж.

Response `200`:

```json
{
  "id": "txn_001",
  "order_id": "ord_txn_001",
  "amount": 299,
  "currency": "RUB",
  "status": "completed",
  "description": "Оплата подписки PRO",
  "payment_method": "card",
  "created_at": "2026-06-01T10:00:00Z"
}
```

## Users

Все эндпоинты раздела требуют `Authorization: Bearer <access_token>`.

### GET `/users/me`

Возвращает профиль текущего пользователя.

Response `200`:

```json
{
  "user_id": "aB3xZ9qW",
  "email": "user@example.com",
  "tg_id": 40203010,
  "subscription_url": "https://example.com",
  "subscription_type": "basic",
  "add_hwid": 0,
  "subscription_expire_at": "2026-07-01T12:00:00Z"
}
```

### PATCH `/users/me/settings`

Обновляет настройки пользователя.

Request:

```json
{ "auto_renew": true }
```

Response `200`:

```json
{
  "user_id": "aB3xZ9qW",
  "auto_renew": true,
  "updated_at": "2026-07-01T12:00:00+00:00"
}
```

## Devices / HWID

Все эндпоинты раздела требуют `Authorization: Bearer <access_token>`.

### GET `/subscriptions/me/devices`

Возвращает список привязанных устройств.

Response `200`:

```json
{
  "devices": [
    {
      "hwid": "hwid_001",
      "name": "Device 1",
      "os": "windows",
      "added_at": "2026-01-15T12:00:00Z"
    },
    {
      "hwid": "hwid_002",
      "name": "Device 2",
      "os": "windows",
      "added_at": "2026-01-15T12:00:00Z"
    }
  ],
  "total": 2,
  "max_allowed": 6
}
```

### DELETE `/subscriptions/me/devices/{hwid}`

Удаляет одно устройство.

Response `204`: без тела ответа.

### DELETE `/subscriptions/me/devices`

Удаляет все устройства пользователя.

Response `204`: без тела ответа.

### POST `/subscriptions/me/add-slots`

Создает заказ на покупку дополнительных HWID-слотов.

Request:

```json
{
  "count": 2,
  "payment_method": "card"
}
```

Response `201`:

```json
{
  "order_id": "ord_slots_001",
  "payment_url": "https://payment-gateway.mock/pay/ord_slots_001",
  "subscription_id": "sub_mock_001",
  "expires_at": "2026-07-26T12:00:00Z"
}
```

## Ошибки

Стандартный формат ошибки:

```json
{ "detail": "Error message" }
```

Основные статусы:

- `401`: невалидный или истекший токен
- `403`: не передан `Authorization` header
- `404`: ресурс не найден
- `422`: ошибка валидации запроса

