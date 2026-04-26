import MessageBubble from "./MessageBubble";

export default function MessageList({ messages, currentUser }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">

      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isOwn={msg.sender_id === currentUser.id}
        />
      ))}

    </div>
  );
}