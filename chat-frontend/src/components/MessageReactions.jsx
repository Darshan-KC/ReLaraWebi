import React, { useState } from 'react';
import './MessageReactions.css';

const AVAILABLE_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '👏'];

export default function MessageReactions({ messageId, initialReactions = {} }) {
  const [reactions, setReactions] = useState(initialReactions);
  const [showPicker, setShowPicker] = useState(false);

  const handleAddReaction = async (emoji) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ emoji }),
      });

      if (response.ok) {
        const newReaction = await response.json();
        setReactions((prev) => ({
          ...prev,
          [emoji]: (prev[emoji] || 0) + 1,
        }));
      }
      setShowPicker(false);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  return (
    <div className="message-reactions">
      <div className="reactions-display">
        {Object.entries(reactions).map(([emoji, count]) => (
          <button
            key={emoji}
            className="reaction-button"
            onClick={() => handleAddReaction(emoji)}
            title={`${count} reaction${count > 1 ? 's' : ''}`}
          >
            {emoji} <span className="reaction-count">{count > 0 ? count : ''}</span>
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
                onClick={() => handleAddReaction(emoji)}
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
