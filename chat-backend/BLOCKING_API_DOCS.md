# Block User API Documentation

## Overview
The Block User API allows users to block other users from messaging them. When a user is blocked, they cannot send messages to conversations with the blocking user and cannot view shared conversations.

## Endpoints

### Get Blocked Users
**GET** `/api/blocked-users`

Retrieve the list of users blocked by the authenticated user.

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `per_page` (integer, optional): Results per page (default: 50, max: 100)

**Response:** 200 OK
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "blocked_user_id": 5,
      "reason": "Spam messages",
      "created_at": "2026-02-10T10:00:00Z",
      "updated_at": "2026-02-10T10:00:00Z",
      "blocked_user": {
        "id": 5,
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "pagination": {
    "total": 3,
    "count": 3,
    "per_page": 50,
    "current_page": 1,
    "total_pages": 1
  }
}
```

---

### Block a User
**POST** `/api/blocked-users`

Block a user from messaging.

**Authentication:** Required

**Request Body:**
```json
{
  "blocked_user_id": 5,
  "reason": "Spam messages"
}
```

**Request Parameters:**
- `blocked_user_id` (integer, required): The ID of the user to block
- `reason` (string, optional): Reason for blocking (max 255 characters)

**Response:** 201 Created
```json
{
  "message": "User blocked successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "blocked_user_id": 5,
    "reason": "Spam messages",
    "created_at": "2026-02-10T10:00:00Z",
    "updated_at": "2026-02-10T10:00:00Z"
  }
}
```

**Error Responses:**
- `422 Unprocessable Entity`: User already blocked or invalid ID
- `422 Unprocessable Entity`: Cannot block yourself

---

### Unblock a User
**DELETE** `/api/blocked-users/{blockedUser}`

Unblock a previously blocked user.

**Authentication:** Required

**URL Parameters:**
- `blockedUser` (integer): The ID of the BlockedUser record

**Response:** 200 OK
```json
{
  "message": "User unblocked successfully"
}
```

**Error Responses:**
- `403 Forbidden`: You can only unblock users you have blocked
- `404 Not Found`: BlockedUser record not found

---

### Check if User is Blocked
**GET** `/api/users/{user}/is-blocked`

Check if the authenticated user has blocked another user.

**Authentication:** Required

**URL Parameters:**
- `user` (integer): The ID of the user to check

**Response:** 200 OK
```json
{
  "is_blocked": true
}
```

---

### Check if User Has Blocked Me
**GET** `/api/users/{user}/has-blocked-me`

Check if another user has blocked the authenticated user.

**Authentication:** Required

**URL Parameters:**
- `user` (integer): The ID of the user to check

**Response:** 200 OK
```json
{
  "has_blocked_me": false
}
```

---

## Usage Examples

### Block a user who is sending spam
```bash
curl -X POST http://localhost:8000/api/blocked-users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "blocked_user_id": 5,
    "reason": "Sending spam messages"
  }'
```

### Get all blocked users
```bash
curl -X GET http://localhost:8000/api/blocked-users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check if a user is blocked
```bash
curl -X GET http://localhost:8000/api/users/5/is-blocked \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Unblock a user
```bash
curl -X DELETE http://localhost:8000/api/blocked-users/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Behavior

- **Blocked users cannot see conversations**: If user A blocks user B, user B cannot send messages to conversations that include user A.
- **Mutual blocking**: Users can independently block each other. Blocking is one-directional.
- **Reason tracking**: Administrators can view blocking reasons for moderation purposes.
- **Unblock anytime**: Users can unblock other users at any time.

---

## Implementation Notes

- The `BlockedUser` model stores blocking relationships
- The `User` model includes helper methods: `hasBlocked()` and `isBlockedBy()`
- Unique constraint prevents duplicate blocks
- Foreign keys ensure referential integrity
