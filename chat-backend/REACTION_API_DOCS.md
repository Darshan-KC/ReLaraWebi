# Message Reactions API Documentation

## Overview
The Message Reactions API allows users to add, remove, and view reactions (emoji) on messages.

## Endpoints

### Add/Toggle Reaction
**POST** `/api/messages/{message}/reactions`

Add a new reaction or toggle off an existing one.

**Request:**
```json
{
  "emoji": "👍"
}
```

**Response:** 
- `201 Created` - New reaction added
- `204 No Content` - Existing reaction removed

---

### Delete Reaction
**DELETE** `/api/messages/{message}/reactions/{reaction}`

Delete a specific reaction (user must be the owner).

**Response:**
- `204 No Content` - Reaction deleted
- `403 Forbidden` - User not authorized

---

### Get Aggregated Reactions
**GET** `/api/messages/{message}/reactions`

Get emoji counts grouped by emoji type.

**Response:**
```json
[
  {
    "emoji": "👍",
    "count": 5
  },
  {
    "emoji": "❤️",
    "count": 3
  }
]
```

---

### Get Detailed Reactions
**GET** `/api/messages/{message}/reactions/detailed`

Get reactions with user information.

**Response:**
```json
[
  {
    "emoji": "👍",
    "count": 2,
    "users": [
      {
        "user_id": 1,
        "user_name": "John Doe"
      },
      {
        "user_id": 2,
        "user_name": "Jane Smith"
      }
    ]
  }
]
```

---

### Get Users by Emoji
**GET** `/api/messages/{message}/reactions/{emoji}/users`

Get all users who reacted with a specific emoji.

**Response:**
```json
[
  {
    "user_id": 1,
    "user_name": "John Doe",
    "reacted_at": "2026-02-07T10:30:00Z"
  }
]
```

---

### Check User Reaction
**GET** `/api/messages/{message}/reactions/{emoji}/has-reacted`

Check if the current user has reacted with a specific emoji.

**Response:**
```json
{
  "has_reacted": true
}
```

---

### Get Reaction Statistics
**GET** `/api/messages/{message}/reactions/stats`

Get statistics about reactions on a message.

**Response:**
```json
{
  "total_reactions": 8,
  "unique_emojis": 2,
  "total_users": 5,
  "most_used": {
    "emoji": "👍",
    "count": 5
  }
}
```

---

## Authentication
All endpoints require `Sanctum` authentication (`auth:sanctum` middleware).

## Rate Limiting
Consider implementing rate limiting to prevent abuse:
- Max 100 reactions per message per user per hour
- Max 1000 reactions per message total

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthenticated"
}
```

### 422 Validation Error
```json
{
  "message": "Validation failed",
  "errors": {
    "emoji": ["An emoji is required"]
  }
}
```

### 404 Not Found
```json
{
  "message": "Not Found"
}
```

### 403 Forbidden
```json
{
  "message": "This action is unauthorized."
}
```
