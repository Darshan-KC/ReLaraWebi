import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function MessageList({ messages, currentUser, messageActions }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;

    if (nearBottom) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-3"
    >

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
