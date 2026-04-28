export default function ChatLayout({ sidebar, children }) {
  return (
    <div className="flex h-[calc(100vh-80px)] bg-white rounded-xl overflow-hidden shadow">

      {/* Sidebar */}
      <div className="w-1/3 border-r">
        {sidebar}
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1">
        {children}
      </div>

    </div>
  );
}