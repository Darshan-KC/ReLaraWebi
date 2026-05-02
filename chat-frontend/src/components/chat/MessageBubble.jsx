export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      
      <div className="flex flex-col max-w-xs">
        
        <div
          className={`px-4 py-2 rounded-lg text-sm
          ${isOwn ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          {message.text}
        </div>

        <span className="text-xs text-gray-400 mt-1 self-end">
          {formatTime(message.created_at)}
        </span>

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