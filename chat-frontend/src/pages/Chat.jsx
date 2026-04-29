import { useState } from "react";
import ChatLayout from "../components/chat/ChatLayout";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import { useAuth } from "../hooks/useAuth";

export default function Chat() {
  const { user } = useAuth();

  const [selectedUser, setSelectedUser] = useState(null);

  const [messages, setMessages] = useState([]);

  // Fake users
  const users = [
    { id: 1, name: "John" },
    { id: 2, name: "Alice" },
  ];

  const handleSend = (text) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender_id: user.id,
    };

    setMessages([...messages, newMessage]);
  };

  return (
    <ChatLayout
      sidebar={
        <ChatSidebar
          users={users}
          onSelect={setSelectedUser}
        />
      }
    >
      {selectedUser ? (
        <>
          <ChatHeader user={selectedUser} />

          <MessageList
            messages={messages}
            currentUser={user}
          />

          <MessageInput onSend={handleSend} />
        </>
      ) : (
        <div className="flex items-center justify-center flex-1 text-gray-500">
          Select a chat to start messaging
        </div>
      )}
    </ChatLayout>
  );
}