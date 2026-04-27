import { useState } from "react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  return (
    <div className="p-4 border-t flex gap-2">

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 px-4 py-2 border rounded-lg"
        placeholder="Type a message..."
      />

      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 rounded-lg"
      >
        Send
      </button>

    </div>
  );
}