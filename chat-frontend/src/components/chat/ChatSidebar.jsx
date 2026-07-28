import Avatar from "../ui/Avatar";

export default function ChatSidebar({
  conversations,
  selectedConversationId,
  currentUserId,
  onSelect,
  loading,
}) {
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Loading conversations...
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 font-semibold border-b">
        Chats
      </div>

      {conversations.length === 0 && (
        <div className="p-4 text-sm text-gray-400 text-center">
          No conversations yet
        </div>
      )}

      {conversations.map((conversation) => {
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
      })}
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
