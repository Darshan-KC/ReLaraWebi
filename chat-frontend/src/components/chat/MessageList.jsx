import MessageBubble from "./MessageBubble";

export default function MessageList({ messages, currentUser, messageActions }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">

      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isOwn={msg.sender_id === currentUser.id}
          reactions={messageActions.getReactionsFor(msg.id)}
          myReactions={messageActions.myReactionsFor(msg.id)}
          onToggleReaction={messageActions.toggleReaction}
          onEdit={messageActions.editMessage}
          onDelete={messageActions.deleteMessage}
          onTogglePin={messageActions.togglePin}
          isBookmarked={messageActions.isBookmarked(msg.id)}
          onToggleBookmark={messageActions.toggleBookmark}
        />
      ))}

    </div>
  );
}
