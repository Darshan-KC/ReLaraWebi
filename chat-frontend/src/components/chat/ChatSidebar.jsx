import { useRef, useState } from "react";
import Avatar from "../ui/Avatar";

export default function ChatSidebar({
  conversations,
  selectedConversationId,
  currentUserId,
  onSelect,
  loading,
  searchResults = [],
  searching = false,
  onSearch,
  onSearchResultClick,
  onClearSearch,
}) {
  const [query, setQuery] = useState("");
  const debounceTimer = useRef(null);

  const isSearching = !!query.trim();

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);

    clearTimeout(debounceTimer.current);

    if (!q.trim()) {
      onClearSearch();
      return;
    }

    debounceTimer.current = setTimeout(() => onSearch(q), 400);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Loading conversations...
      </div>
    );
  }

  const items = isSearching ? searchResults : conversations;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b space-y-2">
        <p className="font-semibold">{isSearching ? "Search results" : "Chats"}</p>

        <input
          value={query}
          onChange={handleChange}
          placeholder="Search conversations..."
          className="w-full px-3 py-1.5 text-sm border rounded-full focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {isSearching && searching && (
          <div className="p-4 text-sm text-gray-400 text-center">
            Searching...
          </div>
        )}

        {isSearching && !searching && items.length === 0 && (
          <div className="p-4 text-sm text-gray-400 text-center">
            No conversations found
          </div>
        )}

        {!isSearching && conversations.length === 0 && (
          <div className="p-4 text-sm text-gray-400 text-center">
            No conversations yet
          </div>
        )}

        {items.map((item) =>
          renderConversation(item, currentUserId, selectedConversationId, isSearching ? onSearchResultClick : onSelect),
        )}
      </div>
    </div>
  );
}

function renderConversation(conversation, currentUserId, selectedConversationId, onSelect) {
  const other = getOtherParticipant(conversation, currentUserId);

  return (
    <div
      key={conversation.id}
      onClick={() => onSelect(conversation)}
      className={`flex items-center gap-3 p-3 cursor-pointer transition
        ${selectedConversationId === conversation.id ? "bg-blue-100" : "hover:bg-gray-100"}`}
    >
      <Avatar name={other?.name} />

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{other?.name}</p>

        <p className="text-xs text-gray-500 truncate">
          {conversation.last_message?.body || "No messages yet"}
        </p>
      </div>

      <span className="text-xs text-gray-400 shrink-0">
        {formatTime(conversation.updated_at)}
      </span>
    </div>
  );
}

function getOtherParticipant(conversation, currentUserId) {
  if (!conversation.participants) return null;

  return conversation.participants.find((p) => p.id !== currentUserId)
    || conversation.participants[0];
}

function formatTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
