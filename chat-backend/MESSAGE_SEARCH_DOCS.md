# Message Search API Documentation

## Overview
The Message Search API allows users to search and filter messages within conversations or across all their conversations.

## Endpoints

### Search Messages in Conversation
**GET** `/api/conversations/{conversation}/messages/search`

Search messages within a specific conversation.

**Query Parameters:**
- `q` (string, optional): Search query to find in message content (max 255 characters)
- `sender_id` (integer, optional): Filter by sender user ID
- `from` (date, optional): Start date for filtering (format: YYYY-MM-DD)
- `to` (date, optional): End date for filtering (format: YYYY-MM-DD)
- `type` (string, optional): Message type - `text`, `image`, `file`, `video`, `audio`
- `per_page` (integer, optional): Results per page (default: 15, max: 100)

**Authentication:** Required (Bearer token)

**Response:** 200 OK
```json
{
  "data": [
    {
      "id": 1,
      "conversation_id": 1,
      "sender_id": 2,
      "body": "Updated message content",
      "type": "text",
      "edit_count": 1,
      "edited_at": "2026-01-07T10:30:00Z",
      "created_at": "2026-01-07T10:00:00Z",
      "updated_at": "2026-01-07T10:30:00Z",
      "sender": {
        "id": 2,
        "name": "John Doe"
      },
      "reactions": [],
      "pins": []
    }
  ],
  "links": {
    "first": "http://localhost:8000/api/conversations/1/messages/search?q=test&page=1",
    "last": "http://localhost:8000/api/conversations/1/messages/search?q=test&page=3",
    "prev": null,
    "next": "http://localhost:8000/api/conversations/1/messages/search?q=test&page=2"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 3,
    "path": "http://localhost:8000/api/conversations/1/messages/search",
    "per_page": 15,
    "to": 15,
    "total": 42
  }
}
```

**Example Requests:**
```bash
# Search for messages containing "hello"
GET /api/conversations/1/messages/search?q=hello

# Search messages from specific user
GET /api/conversations/1/messages/search?sender_id=2

# Search messages in date range
GET /api/conversations/1/messages/search?from=2026-01-01&to=2026-02-09

# Search only image messages
GET /api/conversations/1/messages/search?type=image

# Combine filters
GET /api/conversations/1/messages/search?q=report&sender_id=2&from=2026-01-01&type=file
```

---

### Search Across All Conversations
**GET** `/api/messages/search`

Search messages globally across all conversations where the user is a participant.

**Query Parameters:**
- `q` (string, optional): Search query to find in message content (max 255 characters)
- `sender_id` (integer, optional): Filter by sender user ID
- `from` (date, optional): Start date for filtering (format: YYYY-MM-DD)
- `to` (date, optional): End date for filtering (format: YYYY-MM-DD)
- `type` (string, optional): Message type - `text`, `image`, `file`, `video`, `audio`
- `per_page` (integer, optional): Results per page (default: 15, max: 100)

**Authentication:** Required

**Response:** 200 OK (same format as above, includes `conversation` object)
```json
{
  "data": [
    {
      "id": 1,
      "conversation_id": 1,
      "body": "message content",
      "conversation": {
        "id": 1,
        "name": "General"
      },
      ...
    }
  ]
}
```

**Example Requests:**
```bash
# Global search for "important"
GET /api/messages/search?q=important

# Find all messages from user 5
GET /api/messages/search?sender_id=5

# Search in last month
GET /api/messages/search?from=2026-01-09&to=2026-02-09
```

---

### Get Search Suggestions/Autocomplete
**GET** `/api/conversations/{conversation}/messages/suggestions`

Get autocomplete suggestions based on partial query for a specific conversation.

**Query Parameters:**
- `q` (string, required): Search query for suggestions (max 255 characters)
- `limit` (integer, optional): Number of suggestions to return (default: 10, max: 50)

**Authentication:** Required

**Response:** 200 OK
```json
[
  {
    "id": 45,
    "preview": "This is a message about project updates that matches the search...",
    "sender": "John Doe",
    "created_at": "2026-02-08T14:30:00Z"
  },
  {
    "id": 38,
    "preview": "Another matching message preview here...",
    "sender": "Jane Smith",
    "created_at": "2026-02-07T10:15:00Z"
  }
]
```

**Example Request:**
```bash
# Get suggestions for "proj"
GET /api/conversations/1/messages/suggestions?q=proj&limit=5
```

---

## Error Responses

**400 Bad Request** - Invalid parameters
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "to": ["The end date must be after or equal to the start date."]
  }
}
```

**403 Forbidden** - User not part of conversation
```json
{
  "message": "This action is unauthorized."
}
```

**404 Not Found** - Conversation not found
```json
{
  "message": "No query results for model [App\\Models\\Conversation]"
}
```

---

## Usage Examples

### Search for Messages About a Project
```bash
curl -X GET "http://localhost:8000/api/conversations/1/messages/search?q=project" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Find All Attachments from a User
```bash
curl -X GET "http://localhost:8000/api/messages/search?sender_id=2&type=file" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Messages from Last Week
```bash
curl -X GET "http://localhost:8000/api/conversations/1/messages/search?from=2026-02-02&to=2026-02-09" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
