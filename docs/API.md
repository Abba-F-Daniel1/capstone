# API Documentation

## Overview

TaskFlow Pro provides a RESTful API for managing tasks, habits, and productivity analytics. The API is built with Express.js and uses PostgreSQL as the primary database.

## Base URL

- Development: `http://localhost:3001/api`
- Production: `https://api.taskflow-pro.com/api`

## Authentication

All API endpoints (except authentication) require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "token": "jwt_token"
}
```

#### POST /auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Tasks

#### GET /tasks
Get all tasks for the authenticated user.

**Query Parameters:**
- `status`: Filter by task status (pending, in_progress, completed)
- `priority`: Filter by priority (low, medium, high, urgent)
- `page`: Page number for pagination
- `limit`: Number of tasks per page

#### POST /tasks
Create a new task.

**Request Body:**
```json
{
  "title": "Complete project proposal",
  "description": "Write and submit the Q1 project proposal",
  "priority": "high",
  "dueDate": "2024-01-15T23:59:59Z",
  "category": "work"
}
```

#### PUT /tasks/:id
Update an existing task.

#### DELETE /tasks/:id
Delete a task.

### Habits

#### GET /habits
Get all habits for the authenticated user.

#### POST /habits
Create a new habit.

**Request Body:**
```json
{
  "name": "Daily exercise",
  "description": "30 minutes of physical activity",
  "frequency": "daily",
  "targetValue": 30,
  "unit": "minutes"
}
```

#### POST /habits/:id/entries
Record a habit completion.

**Request Body:**
```json
{
  "date": "2024-01-01",
  "value": 30,
  "notes": "Morning jog in the park"
}
```

### Analytics

#### GET /analytics/productivity
Get productivity analytics for the authenticated user.

**Query Parameters:**
- `period`: Time period (week, month, quarter, year)
- `startDate`: Start date for custom period
- `endDate`: End date for custom period

**Response:**
```json
{
  "tasksCompleted": 45,
  "habitsTracked": 12,
  "productivityScore": 85,
  "trends": {
    "tasksCompleted": [10, 12, 8, 15, 20, 18, 22],
    "habitsCompleted": [5, 7, 6, 8, 9, 7, 10]
  }
}
```

## Error Handling

All API errors follow a consistent format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  }
}
```

## Rate Limiting

API requests are rate limited to:
- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated requests

## Pagination

List endpoints support pagination with the following parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Response includes pagination metadata:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Webhooks

TaskFlow Pro supports webhooks for real-time updates:

- `task.created`
- `task.updated`
- `task.completed`
- `habit.entry.created`

Webhook payloads include the event type and relevant data.
