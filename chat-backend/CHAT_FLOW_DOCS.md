# Chat Flow Documentation

This document explains how the chat feature works end-to-end: how conversations are created, how messages are sent and received (including realtime delivery), and how the read receipts / typing indicators behave.

---

## Overview

The chat is a one-to-one messenger built with:

- **Backend**: Laravel 12 (API + Laravel Reverb WebSocket server)
- **Frontend**: React 19 SPA (Vite, no TypeScript) using `laravel-echo` + `pusher-js`
- **Auth**: Laravel Sanctum (Bearer tokens)

Chats are **private 1:1 conversations** that are only possible between **accepted friends**. A conversation is created automatically either when a friend request is accepted or when a user "opens" a chat with an existing friend.

---

## Architecture Map

### Backend (`chat-backend/`)

Business logic lives in **Action classes**, controllers are thin HTTP adapters.

| Concern | Action class | Controller |
|---------|-------------|------------|
| Open/find a conversation | `app/Actions/Conversation/OpenConversationAction.php` | `ConversationController@open` |
| List conversations | `app/Actions/Conversation/GetUserConversationsAction.php` | `ConversationController@index` |
| Show a conversation | — (inline, uses `assertParticipant`) | `ConversationController@show` |
| Search conversations | `app/Actions/Conversation/SearchConversationsAction.php` | `ConversationController@search` |
| Mark conversation read | `app/Actions/Conversation/MarkConversationReadAction.php` | `ConversationReadController@store` |
| Send a message | `app/Actions/Message/SendMessageAction.php` | `MessageController@storeInConversation` |
| Friend request | `app/Actions/Friendship/SendFriendRequestAction.php` | `FriendshipController@store` |
| Accept friend request (+ create conversation) | `app/Actions/Friendship/AcceptFriendRequestAction.php` | `FriendshipController@accept` |

Key models: `Conversation`, `ConversationParticipant`, `Message`, `Friendship`. `Conversation::assertParticipant()` enforces the domain invariant that a user must be an active participant to access a conversation.

### Frontend (`chat-frontend/`)

| Layer | File |
|-------|------|
| Chat page (composes everything) | `src/pages/chat/Chat.jsx` |
| State + HTTP for conversations/messages | `src/hooks/useChat.js` |
| Realtime subscription | `src/hooks/useChatRealtime.js` |
| Message actions (edit/delete/pin/react/bookmark) | `src/hooks/useMessageActions.js` |
| Typing indicator (polling) | `src/hooks/useTypingIndicator.js` |
| Echo (Reverb) client | `src/lib/echo.js` |
| HTTP wrapper | `src/services/api.js` |
| Chat/message/friendship services | `src/services/chat.service.js`, `message.service.js`, `friendship.service.js`, … |

---

## Flow 1: From "Add Friend" to a Chat

```
[Sender]                    [Backend]                     [Receiver]
   |                              |                              |
   | 1. GET /users                 |                              |
   |------------------------------>|                              |
   | 2. POST /friendships          |                              |
   |  { receiver_id }              |                              |
   |------------------------------>|                              |
   |                               |  creates Friendship (pending) |
   | 3. GET /friend-requests       |                              |
   |                               |<-----------------------------|
   |                               | 4. POST /friendships/{id}/accept
   |                               |------------------------------>|
   |                               |  AcceptFriendRequestAction:   |
   |                               |   - friendship.status=accepted
   |                               |   - create Conversation (type=private)
   |                               |   - create 2 ConversationParticipants
   |                               |   - returns { friendship, conversation }
   | 5. navigate('/chat', state: { conversationId })   |
   |   (receiver jumps straight into the chat)          |
   |                               |                              |
   | 6. GET /conversations (both users see it now)     |
```

Notes:
- Accepting a request **creates the conversation immediately** (`AcceptFriendRequestAction`).
- The frontend `acceptRequest()` in `src/hooks/useFriends.js` returns `result.conversation`, and the accept screen navigates to `/chat` with `{ conversationId }` in router state.
- `Chat.jsx` auto-selects that conversation on mount via `selectConversationById()`.

---

## Flow 2: Opening / Selecting a Conversation

Two entry points:

1. **From the sidebar list** — user clicks an existing conversation → `handleSelectConversation` sets `selectedConversation` → `useChat.selectConversation()` fetches messages.
2. **From a friend** — user opens a chat with a friend who has no conversation yet → `openChat(friendId)`:
   - `POST /conversations/open` with `{ friend_id }`
   - `OpenConversationAction` verifies the friendship is `accepted` (403 otherwise), then **finds** an existing 2-participant conversation or **creates** one.

Message fetching (`useChat.selectConversation`, `useChat.js:35`):

```
GET /conversations/{id}/messages
  -> backend returns messages newest-first (orderBy created_at desc)
  -> frontend reverses: setMessages(data.reverse())
```

`useChat` also holds `conversations` (paged list, 20 per page, ordered by `last_message_at` desc) and per-conversation `unread_count`.

---

## Flow 3: Sending a Message

```
[User A]                          [Backend]                     [User B]
   |                                  |                              |
   | 1. handleSendMessage(body)       |                              |
   |   optimistic UI: temp message    |                              |
   |   appended to `messages`         |                              |
   |                                  |                              |
   | 2. POST /conversations/{id}/messages   { message, type }        |
   |---------------------------------->|                              |
   |                                  | SendMessageAction (DB txn):  |
   |                                  |  - create Message            |
   |                                  |  - update conversation       |
   |                                  |    last_message_id/_at       |
   |                                  |  - event(new MessageSent)    |
   |                                  |    -> broadcasts on          |
   |                                  |    private-conversation.{id} |
   |                                  |    as "message.sent"         |
   |                                  |------------------------------>| 3. useChatRealtime
   |                                  |                              |    receives event,
   |                                  |                              |    appendMessage(msg)
   | 4. HTTP 201 MessageResource      |                              |
   |<----------------------------------|                              |
   |   replaces temp message by id    |                              |
```

Backend message creation: `SendMessageAction::execute()` runs inside a `DB::transaction`:

1. Creates the `Message` (`conversation_id`, `sender_id`, `type`, `body`).
2. Denormalizes the conversation's `last_message_id` / `last_message_at`.
3. Fires `event(new MessageSent($message))` — this is what makes it realtime.

Event payload (`MessageSent@broadcastWith`) contains: `id`, `conversation_id`, `sender_id`, `type`, `body`, `created_at`.

---

## Flow 4: Receiving a Message (Realtime)

Frontend realtime wiring:

- `src/lib/echo.js` creates an Echo client using the **reverb** broadcaster:
  - `key` → `VITE_REVERB_APP_KEY`
  - `wsHost` → `VITE_REVERB_HOST` (localhost)
  - `wsPort` → 8080
  - `authEndpoint` → `http://127.0.0.1:8000/api/broadcasting/auth`
  - Bearer token from `localStorage` is sent for channel auth.
- `src/hooks/useChatRealtime.js` subscribes to the **private channel** `conversation.{id}` and listens for `.message.sent`.
- Backend authorization for the channel lives in `routes/channels.php`:

```php
Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    return ConversationParticipant::query()
        ->where('conversation_id', $conversationId)
        ->where('user_id', $user->id)
        ->exists();
});
```

The full handshake for User B:

```
1. Echo opens ws://localhost:8080
2. Echo requests private channel:  private-conversation.{id}
3. pusher-js POSTs to /api/broadcasting/auth
   (socket_id + channel_name, Bearer token)
4. channels.php authorizes the user as participant
5. Server returns signed channel auth -> subscription established
6. When User A sends a message, Reverb pushes "message.sent"
7. useChatRealtime calls onMessageReceived(message) -> appendMessage()
```

Broadcast names use `broadcastAs('message.sent')`, and the frontend listens with a leading dot (`.message.sent`) so Echo does not prefix the app namespace.

---

## Flow 5: Read Receipts

```
[User B opens conversation]              [Backend]                    [User A]
   |                                          |                          |
   | POST /conversations/{id}/read            |                          |
   |----------------------------------------->|                          |
   |                                          | MarkConversationReadAction:
   |                                          |  - assertParticipant
   |                                          |  - update participant
   |                                          |    last_read_message_id,
   |                                          |    last_read_at (only if newer)
   |                                          |  - event(ConversationRead)
   |                                          |    -> broadcasts
   |                                          |    "conversation.read"
   |                                          |-------------------------->|
   |                                          |                          | sees ✔✔
```

- `unread_count` is computed server-side in `GetUserConversationsAction` by counting messages with `id >` the participant's `last_read_message_id`.
- The `ConversationRead` event (`app/Events/ConversationRead.php`) broadcasts `conversationId`, `userId`, `lastReadMessageId`.

---

## Flow 6: Typing Indicator (Polling, not realtime)

Typing does **not** use WebSockets; it polls the API:

```
1. User types -> useTypingIndicator.notifyTyping()
2. POST /conversations/{id}/typing   (set "I am typing")
3. Set a 3s timer; when it fires -> DELETE /conversations/{id}/typing
4. Receiver polls GET /conversations/{id}/typing every 2.5s
5. GET returns currently-typing users -> header shows "typing..."
```

---

## Message Features (Edit, Delete, Pin, React, Bookmark)

All of these are **HTTP-only** today — there are **no realtime broadcasts** for them, so changes made by one participant do not appear live for the other (they appear after the next fetch / page interaction).

| Feature | Endpoint |
|---------|----------|
| Edit message | `PUT /api/messages/{message}` |
| Soft delete | `DELETE /api/messages/{message}` |
| Restore | `POST /api/messages/{message}/restore` |
| Pin / unpin | `POST/DELETE /api/messages/{message}/pin` |
| React (toggle) | `POST/DELETE /api/messages/{message}/reactions` |
| Reactions detail | `GET /api/messages/{message}/reactions/detailed` |
| Bookmark / unbookmark | `POST/DELETE /api/messages/{message}/bookmark` |

On the frontend these live in `useMessageActions.js`. Reactions load per conversation via `getDetailedReactions()` whenever the message list changes; bookmarks and pins are tracked locally in state.

---

## Realtime Infrastructure

| Setting | Value |
|---------|-------|
| Broadcast driver | `BROADCAST_CONNECTION=reverb` |
| Reverb port | 8080 (also nginx → 8000, frontend → 3000, MySQL → 3306, Redis → 6379) |
| Backend env | `REVERB_APP_KEY`, `REVERB_APP_SECRET`, `REVERB_APP_ID`, `REVERB_HOST`, `REVERB_PORT`, `REVERB_SCHEME` |
| Frontend env | `VITE_REVERB_APP_KEY`, `VITE_REVERB_HOST`, `VITE_REVERB_PORT`, `VITE_REVERB_SSL_PORT` |

**Important**: backend `REVERB_APP_KEY` and frontend `VITE_REVERB_APP_KEY` **must match**, otherwise the WebSocket connection / auth will be rejected.

Broadcast events currently defined:

| Event | Channel | Event name |
|-------|---------|------------|
| `MessageSent` | `private-conversation.{id}` | `message.sent` |
| `ConversationRead` | `private-conversation.{id}` | `conversation.read` |

---

## API Reference (Chat-relevant routes, all under `/api`, `auth:sanctum`)

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/conversations` | List user's conversations (paginated, 20) |
| GET | `/conversations/search?q=` | Search conversations by friend name |
| GET | `/conversations/{id}` | Show a conversation |
| POST | `/conversations/open` | Find or create a conversation with a friend |
| GET | `/conversations/{id}/messages` | List messages (newest first) |
| POST | `/conversations/{id}/messages` | Send a message `{ message, type? }` |
| POST | `/conversations/{id}/read` | Mark conversation read |
| POST | `/conversations/{id}/typing` | Signal typing |
| DELETE | `/conversations/{id}/typing` | Stop typing |
| GET | `/conversations/{id}/typing` | Get typing users |
| GET | `/users` | Discover users (not friends, not self) |
| POST | `/friendships` | Send friend request `{ receiver_id }` |
| POST | `/friendships/{id}/accept` | Accept request + create conversation |
| GET | `/friendships/friends` | List accepted friends |
| POST | `/broadcasting/auth` | Realtime channel auth |

---

## Known Issues / Gotchas

1. **Sender sees duplicate messages.** The sender is also a participant of the private channel, so `MessageSent` is broadcast back to them. Combined with the optimistic temp message in `useChat.js:handleSendMessage`, the same message can be appended twice (once from the broadcast, once replacing the temp message). A fix is to skip the broadcast for the sender or dedupe by `id` in `appendMessage`.

2. **`useChatRealtime` re-subscribes on every render.** `appendMessage` is recreated each render, and `useChatRealtime.js` lists `onMessageReceived` in its effect deps. This causes the private channel to be left/rejoined constantly. Memoize `appendMessage` (or use a ref) to stabilize the subscription.

3. **Realtime is receive-only for messages.** Reactions, edits, pins, bookmarks, and typing are not broadcast — the other participant won't see them until a reload/refetch.

4. **`authEndpoint` is hardcoded** to `http://127.0.0.1:8000/api/broadcasting/auth` while `api.js` uses `http://localhost:8000/api`. Works locally, but any change of host/port must be applied in both places.

5. **Testing uses SQLite in-memory**, so MySQL-specific SQL (e.g. `GREATEST`/`COALESCE` in the commented-out unread query) will fail in tests.
