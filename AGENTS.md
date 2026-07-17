# AGENTS.md

## Project Structure

Two independent apps in a Docker monorepo:
- `chat-backend/` — Laravel 12 API + Reverb WebSocket server
- `chat-frontend/` — React 19 SPA (Vite, Tailwind v4, no TypeScript)
- `docker-compose.yml` — orchestrates backend, frontend, nginx, MySQL 8, Redis

## Commands

### Backend (run from `chat-backend/`)
```bash
composer run setup        # first-time: install, .env, key, migrate, npm build
composer run dev          # concurrently: artisan serve, queue:listen, pail, vite
composer run test         # clears config cache, then artisan test
```

### Frontend (run from `chat-frontend/`)
```bash
npm run dev              # Vite dev server
npm run build            # production build
npm run lint             # ESLint (flat config)
```

### Tests
- PHPUnit in `chat-backend/tests/` — uses **SQLite :memory:** (not MySQL) in testing
- Only 2 feature tests exist (`MessageReactionTest`, `ExampleTest`), 1 unit test
- Run a single test: `cd chat-backend && php artisan test --filter=MessageReactionTest`
- Frontend has no test setup

## Architecture

### Backend Pattern
Business logic lives in **Action classes** (`app/Actions/`), not controllers:
- `Conversation/` — open, list, show
- `Message/` — store
- `MessageReaction/` — toggle, stats
- `Friendship/` — request, accept, list

DTOs in `app/DTO/` mirror each Action directory. Controllers in `app/Http/Controllers/Api/` are thin HTTP adapters.

### Real-Time
- Laravel Reverb (WebSocket) on port **8080**
- Events: `MessageSent`, `ConversationRead` in `app/Events/`
- Frontend connects via `src/echo.js` using `laravel-echo` + `pusher-js`
- Broadcasting auth endpoint: `POST /api/broadcasting/auth`

### Key Models
`Message` uses **SoftDeletes**. `Conversation` has a domain invariant method `assertParticipant()` that throws `DomainException`. Models: User, Conversation, ConversationParticipant, Message, MessageEdit, MessagePin, MessageReaction, TypingIndicator, BlockedUser, MessageBookmark, Friendship.

### Frontend Structure
- Routing: `src/app/router.jsx` with `PrivateRoute` / `PublicRoute` guards
- Auth context: `src/context/AuthContext.jsx`
- Service layer: `src/services/` (api.js is the base fetch wrapper, hardcoded to `http://localhost:8000/api`)
- Custom hooks: `useAuth`, `useChat`, `useChatRealtime`, `useFriends`

## Gotchas

- **Backend `.env` must exist** — `composer run setup` copies `.env.example` if missing
- **Testing uses SQLite in-memory** — do not assume MySQL-specific SQL will work in tests
- **Frontend API URL is hardcoded** in `src/services/api.js` — not env-configurable
- **Reactor key mismatch** — backend `.env` needs `REVERB_*` vars; frontend needs `VITE_REVERB_*` vars; both must match
- **Composer scripts chain** — `composer run setup` runs install + key + migrate + npm build in sequence; do not skip steps
- **Docker ports**: nginx→8000, frontend→3000, MySQL→3306, Redis→6379, Reverb→8080
- **No TypeScript** in frontend — all `.js`/`.jsx`
- **Tailwind v4** — uses `@tailwindcss/vite` plugin, not the old PostCSS approach

## API Docs

Feature-specific API docs exist as markdown in `chat-backend/`:
- `API_FEATURES.md` — editing, pinning, reactions, typing indicators
- `BLOCKING_API_DOCS.md` — user blocking
- `BOOKMARK_API_DOCS.md` — message bookmarks
- `MESSAGE_SEARCH_DOCS.md` — search
- `REACTION_API_DOCS.md` — reactions
