# Message Bookmarks API Documentation

## Overview
The Message Bookmarks API allows users to bookmark important messages for later reference. Users can save bookmarks, add personal notes, and quickly access their saved messages across conversations.

## Endpoints

### Get All Bookmarks
**GET** `/api/bookmarks`

Retrieve all bookmarked messages for the authenticated user, ordered by most recent.

**Query Parameters:**
- `per_page` (integer, optional): Results per page (default: 15, max: 100)
- `page` (integer, optional): Page number (default: 1)

**Authentication:** Required (Bearer token)

**Response:** 200 OK
```json
{
  "data": [
    {
      "id": 1,
      "message_id": 42,
      "user_id": 1,
      "notes": "Important deadline - Q1 2026",
      "message": {
        "id": 42,
        "conversation_id": 5,
        "sender_id": 2,
        "body": "Project deadline is March 31st",
        "type": "text",
        "created_at": "2026-02-10T14:30:00Z",
        "sender": {
          "id": 2,
          "name": "John Doe"
        },
        "reactions": [],
        "pins": []
      },
      "bookmarked_at": "2026-02-11T10:00:00Z"
    }
  ],
  "links": {
    "first": "http://localhost:8000/api/bookmarks?page=1",
    "last": "http://localhost:8000/api/bookmarks?page=1",
    "prev": null,
    "next": null
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 1,
    "path": "http://localhost:8000/api/bookmarks",
    "per_page": 15,
    "to": 1,
    "total": 1
  }
}
```

---

### Get Conversation Bookmarks
**GET** `/api/conversations/{conversation}/bookmarks`

Retrieve all bookmarked messages within a specific conversation.

**Query Parameters:**
- `per_page` (integer, optional): Results per page (default: 15, max: 100)
- `page` (integer, optional): Page number (default: 1)

**Authentication:** Required

**Response:** 200 OK (same format as above)

**Example Request:**
```bash
GET /api/conversations/5/bookmarks?per_page=20
```

---

### Bookmark a Message
**POST** `/api/messages/{message}/bookmark`

Add a message to the user's bookmarks. Optionally include personal notes.

**Request:**
```json
{
  "notes": "Important deadline - Q1 2026"
}
```

**Authentication:** Required

**Response:** 201 Created
```json
{
  "id": 1,
  "message_id": 42,
  "user_id": 1,
  "notes": "Important deadline - Q1 2026",
  "message": {
    "id": 42,
    "conversation_id": 5,
    "sender_id": 2,
    "body": "Project deadline is March 31st",
    "type": "text",
    "created_at": "2026-02-10T14:30:00Z",
    "sender": {
      "id": 2,
      "name": "John Doe"
    }
  },
  "bookmarked_at": "2026-02-11T10:00:00Z"
}
```

**Error Response:** 409 Conflict (if message is already bookmarked)
```json
{
  "message": "Message already bookmarked"
}
```

**Example Request:**
```bash
POST /api/messages/42/bookmark
Content-Type: application/json

{
  "notes": "Follow up with this person"
}
```

---

### Remove Bookmark
**DELETE** `/api/messages/{message}/bookmark`

Remove a message from the user's bookmarks.

**Authentication:** Required

**Response:** 204 No Content

**Error Response:** 404 Not Found (if bookmark doesn't exist)
```json
{
  "message": "Bookmark not found"
}
```

**Example Request:**
```bash
DELETE /api/messages/42/bookmark
```

---

### Update Bookmark Notes
**PUT** `/api/bookmarks/{bookmark}`

Update the notes associated with a bookmark.

**Request:**
```json
{
  "notes": "Updated notes - Completed on Feb 10"
}
```

**Authentication:** Required

**Response:** 200 OK
```json
{
  "id": 1,
  "message_id": 42,
  "user_id": 1,
  "notes": "Updated notes - Completed on Feb 10",
  "message": {
    "id": 42,
    "conversation_id": 5,
    "sender_id": 2,
    "body": "Project deadline is March 31st",
    "type": "text",
    "created_at": "2026-02-10T14:30:00Z"
  },
  "bookmarked_at": "2026-02-11T10:00:00Z"
}
```

**Validation:**
- `notes`: Optional, max 500 characters

**Example Request:**
```bash
PUT /api/bookmarks/1
Content-Type: application/json

{
  "notes": "Completed on Feb 10"
}
```

---

### Check if Message is Bookmarked
**GET** `/api/messages/{message}/bookmark/check`

Check whether the authenticated user has bookmarked a specific message.

**Authentication:** Required

**Response:** 200 OK
```json
{
  "is_bookmarked": true
}
```

**Example Request:**
```bash
GET /api/messages/42/bookmark/check
```

---

## Use Cases

### Save important announcements
```bash
POST /api/messages/42/bookmark
{
  "notes": "Company-wide announcement about new policy"
}
```

### Retrieve all bookmarks across conversations
```bash
GET /api/bookmarks
```

### Find bookmarks in a specific conversation
```bash
GET /api/conversations/5/bookmarks
```

### Update bookmark context/notes
```bash
PUT /api/bookmarks/1
{
  "notes": "Need to follow up on this by Friday"
}
```

### Remove bookmark
```bash
DELETE /api/messages/42/bookmark
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

### 403 Forbidden
```json
{
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "message": "Not found"
}
```

### 409 Conflict
```json
{
  "message": "Message already bookmarked"
}
```

---

## Rate Limiting
- Bookmark/Unbookmark: 60 requests per minute per user
- Get Bookmarks: 120 requests per minute per user

---

## Notes
- Users can only bookmark messages from conversations they are part of
- Each user can bookmark the same message independently
- Bookmarks are soft-deleted when the message is deleted
- Notes field supports up to 500 characters for personal annotations
