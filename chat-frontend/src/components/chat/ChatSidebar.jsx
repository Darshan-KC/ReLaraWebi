import Avatar from "../ui/Avatar";

export default function ChatSidebar({
  chats,
  selectedChatId,
  onSelect,
}) {
  return (
    <div className="h-full overflow-y-auto">

      <div className="p-4 font-semibold border-b">
        Chats
      </div>

      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelect(chat)}
          className={`flex items-center gap-3 p-3 cursor-pointer transition
            ${selectedChatId === chat.id ? "bg-blue-100" : "hover:bg-gray-100"}`}
        >
          <Avatar name={chat.user.name} />

          <div className="flex-1">
            <p className="font-medium">{chat.user.name}</p>

            <p className="text-xs text-gray-500 truncate">
              {chat.lastMessage}
            </p>
          </div>

          <span className="text-xs text-gray-400">
            {formatTime(chat.updatedAt)}
          </span>
        </div>
      ))}

    </div>
  );
}

// helper
function formatTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}