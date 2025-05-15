## Установите зависимости
```bash
npm i
```

## Настройка переменных окружения
Скопируйте файл `.env.example` в `.env` и при необходимости измените значения:
```bash
cp .env.example .env
```

## Примените миграции базы данных
```bash
npx prisma migrate dev --name init
```

## Запуск
### В режиме разработки
```bash
npm run dev
```

### В продакшене
```bash
npm run build
npm run start
```

## API Эндпоинты

Базовый URL: /api/tickets

|       |                     |                                                                       |                                                  |
| ----- | ------------------- | --------------------------------------------------------------------- | ------------------------------------------------ |
| Метод | URL                 | Описание                                                              | Тело запроса (DTO)                               |
| POST  | /                   | Создать новое обращение                                               | CreateTicketDto (subject, text)                  |
| GET   | /                   | Получить список обращений (фильтры: date, startDate, endDate, status) | - (фильтры в query string, FilterTicketsDto)     |
| PUT   | /:id/in-progress    | Взять обращение в работу                                              | -                                                |
| PUT   | /:id/complete       | Завершить обработку обращения                                         | CompleteTicketDto (опционально solutionText)     |
| PUT   | /:id/cancel         | Отменить обращение                                                    | CancelTicketDto (опционально cancellationReason) |
| PUT   | /cancel-in-progress | Отменить все обращения в статусе "в работе"                           | (опционально cancellationReason)    |