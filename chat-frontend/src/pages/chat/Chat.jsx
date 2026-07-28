import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ChatLayout from "../../components/chat/ChatLayout";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatHeader from "../../components/chat/ChatHeader";
import MessageList from "../../components/chat/MessageList";
import MessageInput from "../../components/chat/MessageInput";
import { useAuth } from "../../hooks/useAuth";
import useChat from "../../hooks/useChat";
import useChatRealtime from "../../hooks/useChatRealtime";

export default function Chat() {
  const { user } = useAuth();
  const location = useLocation();

  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
    messages,
    handleSendMessage,
    appendMessage,
    selectConversationById,
    refreshConversations,
    loadingConversations,
    loadingMessages,
  } = useChat(user);

  useChatRealtime({
    conversationId: selectedConversation?.id,
    onMessageReceived: appendMessage,
  });

  // Auto-select conversation if navigated with state (e.g., after accepting friend request)
  useEffect(() => {
    const conversationId = location.state?.conversationId;

    if (conversationId) {
      refreshConversations().then(() => {
        selectConversationById(conversationId);
      });

      window.history.replaceState({}, document.title);
    }
  }, [location.state?.conversationId, refreshConversations, selectConversationById]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <ChatLayout
      sidebar={
        <ChatSidebar
          conversations={conversations}
          selectedConversationId={selectedConversation?.id}
          currentUserId={user.id}
          onSelect={handleSelectConversation}
          loading={loadingConversations}
        />
      }
    >
      {selectedConversation ? (
        <>
          <ChatHeader
            conversation={selectedConversation}
            currentUserId={user.id}
          />

          <MessageList
            messages={messages}
            currentUser={user}
            loading={loadingMessages}
          />

          <MessageInput
            onSend={handleSendMessage}
            showSuggestions={messages.length === 0}
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
