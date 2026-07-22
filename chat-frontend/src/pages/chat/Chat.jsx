import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ChatLayout from "../../components/chat/ChatLayout";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatHeader from "../../components/chat/ChatHeader";
import MessageList from "../../components/chat/MessageList";
import MessageInput from "../../components/chat/MessageInput";
import { useAuth } from "../../hooks/useAuth";
import useChat from "../../hooks/useChat";
import useChatRealtime from "../../hooks/useChatRealtime";

import { getUserChats, getMessagesByChat } from "../../mocks/helpers/chatHelpers";

export default function Chat() {
  const { user } = useAuth();
  const location = useLocation();

  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  // Chat logic
  const {
    selectedConversation,
    messages,
    appendMessage,
    selectConversationById,
    refreshConversations,
  } = useChat(user);

  // Realtime
  useChatRealtime({
    conversationId: selectedConversation?.id,
    onMessageReceived: appendMessage,
  });

  useEffect(() => {
    const chats = getUserChats(user.id);
    setChatList(chats);
  }, [user.id]);

  // Auto-select conversation if navigated with state (e.g., after accepting friend request)
  useEffect(() => {
    const conversationId = location.state?.conversationId;

    if (conversationId) {
      refreshConversations().then(() => {
        selectConversationById(conversationId);
      });

      // Clear the state so it doesn't re-trigger
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.conversationId, refreshConversations, selectConversationById]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);

    const result = getMessagesByChat(chat.id);
    setChatMessages(result);
  };

  const handleSend = (text) => {
    if (!selectedChat) return;

    const newMessage = {
      id: Date.now(),
      chat_id: selectedChat.id,
      sender_id: user.id,
      text,
    };

    setChatMessages((prev) => [...prev, newMessage]);
  };

  return (
    <ChatLayout
      sidebar={
        <ChatSidebar
          chats={chatList}
          onSelect={(u) => {
            const chat = chatList.find(
              (c) => c.user.id === u.id
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
            messages={chatMessages}
            currentUser={user}
          />

          <MessageInput
            onSend={handleSend}
            showSuggestions={selectedConversation && messages.length === 0}
          />
        </>
      ) : (
        <div className="flex items-center justify-center flex-1 text-gray-500">
          Select a chat
        </div>
      )}
    </ChatLayout>
  );
}