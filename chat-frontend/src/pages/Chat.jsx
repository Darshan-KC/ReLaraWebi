// import { useState } from "react";
// import ChatLayout from "../components/chat/ChatLayout";
// import ChatSidebar from "../components/chat/ChatSidebar";
// import ChatHeader from "../components/chat/ChatHeader";
// import MessageList from "../components/chat/MessageList";
// import MessageInput from "../components/chat/MessageInput";
// import { useAuth } from "../hooks/useAuth";

// export default function Chat() {
//   const { user } = useAuth();

//   const [selectedUser, setSelectedUser] = useState(null);

//   const [messages, setMessages] = useState([]);

//   // Fake users
//   const users = [
//     { id: 1, name: "John" },
//     { id: 2, name: "Alice" },
//   ];

//   const handleSend = (text) => {
//     const newMessage = {
//       id: Date.now(),
//       text,
//       sender_id: user.id,
//     };

//     setMessages([...messages, newMessage]);
//   };

//   return (
//     <ChatLayout
//       sidebar={
//         <ChatSidebar
//           users={users}
//           onSelect={setSelectedUser}
//         />
//       }
//     >
//       {selectedUser ? (
//         <>
//           <ChatHeader user={selectedUser} />

//           <MessageList
//             messages={messages}
//             currentUser={user}
//           />

//           <MessageInput onSend={handleSend} />
//         </>
//       ) : (
//         <div className="flex items-center justify-center flex-1 text-gray-500">
//           Select a chat to start messaging
//         </div>
//       )}
//     </ChatLayout>
//   );
// }


import { useState, useEffect } from "react";
import ChatLayout from "../components/chat/ChatLayout";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import { useAuth } from "../hooks/useAuth";

import { getUserChats, getMessagesByChat } from "../mocks/helpers/chatHelpers";

export default function Chat() {
  const { user } = useAuth();

  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const chats = getUserChats(user.id);
    setChatList(chats);
  }, [user.id]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);

    const chatMessages = getMessagesByChat(chat.id);
    setMessages(chatMessages);
  };

  const handleSend = (text) => {
    const newMessage = {
      id: Date.now(),
      chat_id: selectedChat.id,
      sender_id: user.id,
      text,
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <ChatLayout
      sidebar={
        <ChatSidebar
          users={chatList.map((chat) => chat.user)}
          onSelect={(user) => {
            const chat = chatList.find(
              (c) => c.user.id === user.id
            );
            handleSelectChat(chat);
          }}
        />
      }
    >
      {selectedChat ? (
        <>
          <ChatHeader user={selectedChat.user} />

          <MessageList
            messages={messages}
            currentUser={user}
          />

          <MessageInput onSend={handleSend} />
        </>
      ) : (
        <div className="flex items-center justify-center flex-1 text-gray-500">
          Select a chat
        </div>
      )}
    </ChatLayout>
  );
}