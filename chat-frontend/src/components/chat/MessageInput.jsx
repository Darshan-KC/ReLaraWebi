import { useState } from "react";

const GREETING_SUGGESTIONS = ["Hello!", "Hi!", "Hey there!", "How are you?"];

export default function MessageInput({ onSend, showSuggestions = false }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  const handleSuggestion = (suggestion) => {
    onSend(suggestion);
  };

  return (
    <div className="border-t bg-white">
      {showSuggestions && !text && (
        <div className="px-4 pt-3 flex flex-wrap gap-2">
          <span className="text-xs text-gray-400 self-center mr-1">
            Say something:
          </span>
          {GREETING_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestion(suggestion)}
              className="px-3 py-1.5 text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full border border-blue-200 transition"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />

        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-5 rounded-full"
        >
          ➤
        </button>
      </div>
    </div>
  );
}