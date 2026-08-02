import React, { useState } from "react";
import "./MessageReactions.css";

const AVAILABLE_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "👏"];

export default function MessageReactions({
  messageId,
  reactions = {},
  myReactions = [],
  onToggleReaction,
}) {
  const [showPicker, setShowPicker] = useState(false);

  const mySet = Array.isArray(myReactions)
    ? new Set(myReactions)
    : myReactions || new Set();

  const handleToggle = (emoji) => {
    onToggleReaction(messageId, emoji);
    setShowPicker(false);
  };

  return (
    <div className="message-reactions">
      <div className="reactions-display">
        {Object.entries(reactions).map(([emoji, count]) => (
          <button
            key={emoji}
            className={`reaction-button ${mySet.has(emoji) ? "reaction-button-active" : ""}`}
            onClick={() => handleToggle(emoji)}
            title={`${count} reaction${count > 1 ? "s" : ""}`}
          >
            {emoji} <span className="reaction-count">{count}</span>
          </button>
        ))}
      </div>

      <div className="reaction-picker-container">
        <button
          className="reaction-add-button"
          onClick={() => setShowPicker(!showPicker)}
          title="Add reaction"
        >
          😊
        </button>

        {showPicker && (
          <div className="reaction-picker">
            {AVAILABLE_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                className="emoji-option"
                onClick={() => handleToggle(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
