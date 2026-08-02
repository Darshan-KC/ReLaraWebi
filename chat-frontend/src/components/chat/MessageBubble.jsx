import { useState } from "react";
import Dropdown from "../overlay/Dropdown";
import MessageReactions from "../MessageReactions";

export default function MessageBubble({
  message,
  isOwn,
  onEdit,
  onDelete,
  onTogglePin,
  isBookmarked,
  onToggleBookmark,
  reactions,
  myReactions,
  onToggleReaction,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.body);

  const handleSaveEdit = async () => {
    if (!draft.trim()) return;

    await onEdit(message.id, draft);
    setEditing(false);
  };

  const menu = (close) => (
    <>
      {isOwn && (
        <button
          onClick={() => {
            setDraft(message.body);
            setEditing(true);
            close();
          }}
          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
        >
          Edit
        </button>
      )}

      {isOwn && (
        <button
          onClick={() => {
            onDelete(message.id);
            close();
          }}
          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
        >
          Delete
        </button>
      )}

      <button
        onClick={() => {
          onTogglePin(message.id);
          close();
        }}
        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
      >
        {message.is_pinned ? "Unpin" : "Pin"}
      </button>

      <button
        onClick={() => {
          onToggleBookmark(message.id);
          close();
        }}
        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
      >
        {isBookmarked ? "Remove bookmark" : "Bookmark"}
      </button>
    </>
  );

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} group`}>
      <div className="flex flex-col max-w-xs">
        <div
          className={`flex items-start gap-2 px-4 py-2 rounded-lg text-sm
          ${isOwn ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit();
                  if (e.key === "Escape") setEditing(false);
                }}
                className="px-2 py-1 text-sm text-gray-900 bg-white rounded border"
              />
              <button
                onClick={handleSaveEdit}
                className="text-xs text-blue-700 font-semibold"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="text-xs text-gray-500"
              >
                Cancel
              </button>
            </div>
          ) : (
            <span>{message.body}</span>
          )}

          {message.is_pinned && !editing && <span>📌</span>}
        </div>

        <div
          className={`text-xs mt-1 flex items-center gap-1
          ${isOwn ? "self-end" : "self-start"} text-gray-400`}
        >
          {message.edit_count > 0 && !editing && <span>(edited)</span>}
          <span>{formatTime(message.created_at)}</span>

          <Dropdown
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            trigger={
              <button className="text-gray-400 hover:text-gray-600 text-xs px-1">
                ⋯
              </button>
            }
          >
            {menu}
          </Dropdown>
        </div>

        <MessageReactions
          messageId={message.id}
          reactions={reactions}
          myReactions={myReactions}
          onToggleReaction={onToggleReaction}
        />
      </div>
    </div>
  );
}

function formatTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
