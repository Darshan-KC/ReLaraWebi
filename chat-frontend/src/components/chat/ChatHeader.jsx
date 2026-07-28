import Avatar from "../ui/Avatar";

export default function ChatHeader({ conversation, currentUserId }) {
  if (!conversation) return null;

  const other = conversation.participants?.find((p) => p.id !== currentUserId)
    || conversation.participants?.[0];

  if (!other) return null;

  return (
    <div className="flex items-center gap-3 p-4 border-b">
      <Avatar name={other.name} />
      <div>
        <p className="font-semibold">{other.name}</p>
        <p className="text-xs text-gray-400">Direct message</p>
      </div>
    </div>
  );
}
