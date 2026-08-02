import Avatar from "../ui/Avatar";
import Dropdown from "../overlay/Dropdown";

export default function ChatHeader({
  conversation,
  currentUserId,
  typingUsers = [],
  isBlocked = false,
  onBlock,
  onUnblock,
}) {
  if (!conversation) return null;

  const other = conversation.participants?.find((p) => p.id !== currentUserId)
    || conversation.participants?.[0];

  if (!other) return null;

  const isTyping = typingUsers.some((u) => u.user_id === other.id);

  return (
    <div className="flex items-center gap-3 p-4 border-b">
      <Avatar name={other.name} />

      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{other.name}</p>

        <p className={`text-xs ${isTyping ? "text-blue-500" : "text-gray-400"}`}>
          {isTyping ? "typing..." : isBlocked ? "Blocked" : "Direct message"}
        </p>
      </div>

      <Dropdown
        trigger={
          <button className="text-gray-500 hover:text-gray-700 text-lg px-1">
            ⋯
          </button>
        }
      >
        {(close) =>
          isBlocked ? (
            <button
              onClick={() => {
                onUnblock();
                close();
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
            >
              Unblock user
            </button>
          ) : (
            <button
              onClick={() => {
                onBlock();
                close();
              }}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
            >
              Block user
            </button>
          )
        }
      </Dropdown>
    </div>
  );
}
