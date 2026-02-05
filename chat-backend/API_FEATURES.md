# Chat API - New Features Documentation

## Message Editing & Deletion

### Edit a Message
**Endpoint:** `PUT /api/messages/{message}`

**Authentication:** Required (Bearer token)

**Request:**
```json
{
  "body": "Updated message content"
}
```

**Response:** 200 OK
```json
{
  "id": 1,
  "conversation_id": 1,
  "sender_id": 1,
  "body": "Updated message content",
  "type": "text",
  "edit_count": 1,
  "edited_at": "2026-01-07T10:30:00Z",
  "created_at": "2026-01-07T10:00:00Z",
  "updated_at": "2026-01-07T10:30:00Z"
}
```

### Delete a Message (Soft Delete)
**Endpoint:** `DELETE /api/messages/{message}`

**Authentication:** Required

**Response:** 204 No Content

### Restore a Deleted Message
**Endpoint:** `POST /api/messages/{id}/restore`

**Authentication:** Required

**Response:** 200 OK (returns restored message)

### Get Message Edit History
**Endpoint:** `GET /api/messages/{message}/edits`

**Authentication:** Required

**Response:** 200 OK
```json
[
  {
    "id": 1,
    "original_body": "Original text",
    "edited_body": "Updated text",
    "edited_by": "John Doe",
    "edited_at": "2026-01-07T10:30:00Z"
  }
]
```

---

## Message Pinning

### Pin a Message
**Endpoint:** `POST /api/messages/{message}/pin`

**Authentication:** Required

**Response:** 201 Created
```json
{
  "message_id": 1,
  "is_pinned": true,
  "pinned_at": "2026-01-07T10:45:00Z",
  "pinned_by": "John Doe"
}
```

### Unpin a Message
**Endpoint:** `DELETE /api/messages/{message}/pin`

**Authentication:** Required

**Response:** 204 No Content

### Get Pinned Messages in Conversation
**Endpoint:** `GET /api/conversations/{conversationId}/pinned`

**Authentication:** Required

**Response:** 200 OK
```json
[
  {
    "id": 1,
    "body": "Important announcement",
    "type": "text",
    "sender": {
      "id": 1,
      "name": "John Doe"
    },
    "pinned_at": "2026-01-07T10:45:00Z",
    "pinned_by": "John Doe",
    "reaction_count": 5,
    "created_at": "2026-01-07T10:00:00Z"
  }
]
```

---

## Message Reactions (Enhanced)

### Add/Toggle Reaction
**Endpoint:** `POST /api/messages/{message}/reactions`

**Authentication:** Required

**Request:**
```json
{
  "emoji": "👍"
}
```

**Response:** 201 Created (or 204 if removing)

### Get Aggregated Reactions
**Endpoint:** `GET /api/messages/{message}/reactions`

**Authentication:** Not required

**Response:** 200 OK
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

### Get Detailed Reactions with Users
**Endpoint:** `GET /api/messages/{message}/reactions/detailed`

**Authentication:** Not required

**Response:** 200 OK
```json
[
  {
    "emoji": "👍",
    "count": 5,
    "users": [
      {"user_id": 1, "user_name": "John Doe"},
      {"user_id": 2, "user_name": "Jane Smith"}
    ]
  }
]
```

### Get Users for Specific Emoji
**Endpoint:** `GET /api/messages/{message}/reactions/{emoji}/users`

**Authentication:** Not required

**Response:** 200 OK
```json
[
  {
    "user_id": 1,
    "user_name": "John Doe",
    "reacted_at": "2026-01-07T10:15:00Z"
  }
]
```

### Check if Current User Reacted
**Endpoint:** `GET /api/messages/{message}/reactions/{emoji}/has-reacted`

**Authentication:** Required

**Response:** 200 OK
```json
{
  "has_reacted": true
}
```

### Get Reaction Statistics
**Endpoint:** `GET /api/messages/{message}/reactions/stats`

**Authentication:** Not required

**Response:** 200 OK
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

### Delete Specific Reaction
**Endpoint:** `DELETE /api/messages/{message}/reactions/{reaction}`

**Authentication:** Required

**Response:** 204 No Content

---

## Typing Indicators

### Set Typing Status
**Endpoint:** `POST /api/conversations/{conversation}/typing`

**Authentication:** Required

**Response:** 201 Created
```json
{
  "status": "typing"
}
```

*Note: Typing status expires after 3 seconds of inactivity*

### Clear Typing Status
**Endpoint:** `DELETE /api/conversations/{conversation}/typing`

**Authentication:** Required

**Response:** 204 No Content

### Get Currently Typing Users
**Endpoint:** `GET /api/conversations/{conversation}/typing`

**Authentication:** Required

**Response:** 200 OK
```json
[
  {
    "user_id": 1,
    "user_name": "John Doe"
  },
  {
    "user_id": 3,
    "user_name": "Mike Johnson"
  }
]
```

---

## Database Schema

### New Tables

#### message_pins
- `id` - Primary Key
- `message_id` - Foreign Key to messages
- `conversation_id` - Foreign Key to conversations
- `pinned_by` - Foreign Key to users
- `created_at`, `updated_at`

#### typing_indicators
- `id` - Primary Key
- `conversation_id` - Foreign Key to conversations
- `user_id` - Foreign Key to users
- `expires_at` - Timestamp for auto-expiration
- `created_at`, `updated_at`

#### message_edits
- `id` - Primary Key
- `message_id` - Foreign Key to messages
- `original_body` - Original message text
- `edited_body` - Updated message text
- `edited_by` - Foreign Key to users
- `created_at`, `updated_at`

### Modified Tables

#### messages
- Added: `is_pinned` (boolean)
- Added: `pinned_by` (nullable foreign key)
- Added: `pinned_at` (nullable timestamp)
- Added: `edit_count` (integer)

---

## Authorization

- **Message Editing**: Only the message sender can edit
- **Message Deletion**: Only the message sender can delete
- **Message Restoration**: Only the message sender can restore
- **Message Pinning**: Any conversation participant can pin
- **Reaction Management**: Users can only manage their own reactions
- **Typing Indicators**: Only conversation participants can set/clear

---

## Broadcasting Events (Ready for Integration)

Consider implementing WebSocket broadcasting for real-time updates:

- `MessageEdited` - When a message is edited
- `MessageDeleted` - When a message is deleted
- `MessagePinned` - When a message is pinned
- `MessageUnpinned` - When a message is unpinned
- `UserTyping` - When a user starts typing
- `UserStoppedTyping` - When a user stops typing
- `ReactionAdded` - When a reaction is added
- `ReactionRemoved` - When a reaction is removed

---

## Usage Examples

### Frontend: Toggle Reaction (React)
```javascript
async function toggleReaction(messageId, emoji) {
  const response = await fetch(`/api/messages/${messageId}/reactions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ emoji })
  });
  return response;
}
```

### Frontend: Set Typing Indicator (React)
```javascript
function setupTypingIndicator(conversationId, token) {
  let typingTimeout;
  
  const setTyping = async () => {
    clearTimeout(typingTimeout);
    await fetch(`/api/conversations/${conversationId}/typing`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    typingTimeout = setTimeout(() => {
      fetch(`/api/conversations/${conversationId}/typing`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    }, 3000);
  };
  
  return setTyping;
}
```

### Frontend: Edit Message (React)
```javascript
async function editMessage(messageId, newBody) {
  const response = await fetch(`/api/messages/${messageId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ body: newBody })
  });
  return response.json();
}
```
