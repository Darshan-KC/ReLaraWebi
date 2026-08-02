import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChatLayout from "../../components/chat/ChatLayout";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatHeader from "../../components/chat/ChatHeader";
import MessageList from "../../components/chat/MessageList";
import MessageInput from "../../components/chat/MessageInput";
import { useAuth } from "../../hooks/useAuth";
import useChat from "../../hooks/useChat";
import useChatRealtime from "../../hooks/useChatRealtime";
import useMessageActions from "../../hooks/useMessageActions";
import useTypingIndicator from "../../hooks/useTypingIndicator";
import {
  isBlocked as isBlockedApi,
  blockUser,
  unblockUser,
  getBlockedUsers,
} from "../../services/block.service";
import { searchGlobalMessages } from "../../services/search.service";

export default function Chat() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
    messages,
    setMessages,
    handleSendMessage,
    appendMessage,
    selectConversationById,
    refreshConversations,
    loadingConversations,
  } = useChat(user);

  useChatRealtime({
    conversationId: selectedConversation?.id,
    onMessageReceived: appendMessage,
  });

  const messageActions = useMessageActions(messages, setMessages, user);
  const { typingUsers, notifyTyping } = useTypingIndicator(selectedConversation?.id);

  const otherUserId =
    selectedConversation?.participants?.find((p) => p.id !== user.id)?.id || null;

  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (!otherUserId) {
      setIsBlocked(false);
      return;
    }

    let cancelled = false;

    isBlockedApi(otherUserId)
      .then((blocked) => {
        if (!cancelled) setIsBlocked(blocked);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [otherUserId]);

  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (query) => {
    setSearching(true);

    try {
      const results = await searchGlobalMessages({ q: query });
      setSearchResults(results || []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => setSearchResults([]);

  const handleSearchResultClick = async (result) => {
    await selectConversationById(result.conversation_id);
    handleClearSearch();
  };

  const handleSend = async (body) => {
    try {
      await handleSendMessage(body);
    } catch {
      alert("Failed to send message");
    }
  };

  const handleBlock = async () => {
    if (!otherUserId) return;

    try {
      await blockUser(otherUserId);
      setIsBlocked(true);
    } catch (error) {
      alert(error?.message || "Failed to block user");
    }
  };

  const handleUnblock = async () => {
    if (!otherUserId) return;

    try {
      const blocked = await getBlockedUsers();
      const entry = (blocked || []).find((b) => b.blocked_user_id === otherUserId);

      if (entry) await unblockUser(entry.id);

      setIsBlocked(false);
    } catch (error) {
      alert(error?.message || "Failed to unblock user");
    }
  };

  // Auto-select conversation if navigated with state (e.g., after accepting friend request)
  useEffect(() => {
    const conversationId = location.state?.conversationId;

    if (conversationId) {
      refreshConversations().then(() => {
        selectConversationById(conversationId);
      });

      navigate(".", { replace: true, state: {} });
    }
  }, [location.state?.conversationId, refreshConversations, selectConversationById, navigate]);

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
          searchResults={searchResults}
          searching={searching}
          onSearch={handleSearch}
          onSearchResultClick={handleSearchResultClick}
          onClearSearch={handleClearSearch}
        />
      }
    >
      {selectedConversation ? (
        <>
          <ChatHeader
            conversation={selectedConversation}
            currentUserId={user.id}
            typingUsers={typingUsers}
            isBlocked={isBlocked}
            onBlock={handleBlock}
            onUnblock={handleUnblock}
          />

          <MessageList
            messages={messages}
            currentUser={user}
            messageActions={messageActions}
          />

          <MessageInput
            onSend={handleSend}
            onTyping={notifyTyping}
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
