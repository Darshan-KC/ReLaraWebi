export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      
      <div
        className={`px-4 py-2 rounded-lg max-w-xs text-sm
        ${isOwn ? "bg-blue-600 text-white" : "bg-gray-200"}`}
      >
        {message.text}
      </div>
   </div>
  );
}