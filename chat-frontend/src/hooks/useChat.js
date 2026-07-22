import { useEffect, useState } from "react";

import {
  openConversation,
  getConversations,
  getMessages,
  sendMessage,
} from "../services/chat.service";

export default function useChat(user) {
  const [conversations, setConversations] = useState([]);

  const [selectedConversation, setSelectedConversation] = useState(null);

  const [messages, setMessages] = useState([]);

  const [loadingConversations, setLoadingConversations] = useState(false);

  const [loadingMessages, setLoadingMessages] = useState(false);

  // Fetch conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch conversations function
  const fetchConversations = async () => {
    try {
      setLoadingConversations(true);

      const data = await getConversations();

      setConversations(data);
    } finally {
      setLoadingConversations(false);
    }
  };

  // Select conversation
  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation);

    try {
      setLoadingMessages(true);

      const data = await getMessages(conversation.id);

      setMessages(data.reverse());
    } finally {
      setLoadingMessages(false);
    }
  };

  // Send message
  const handleSendMessage = async (body) => {
    if (!selectedConversation) return;

    // Optimistic UI
    const tempMessage = {
      id: Date.now(),
      body,
      sender_id: user.id,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const savedMessage = await sendMessage(selectedConversation.id, body);

      // Replace temp message
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempMessage.id ? savedMessage : msg)),
      );
    } catch (error) {
      // rollback
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));

      throw error;
    }
  };

  // Receive realtime message
  const appendMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  // Open or find existing conversation with a friend
  const openChat = async (friendId) => {
    const conversation = await openConversation(friendId);

    await selectConversation(conversation);

    await fetchConversations();

    return conversation;
  };

  // Select a conversation by its ID (for pre-selecting after accept)
  const selectConversationById = async (conversationId) => {
    const found = conversations.find((c) => c.id === conversationId);

    if (found) {
      await selectConversation(found);
      return;
    }

    // If not in list yet, refetch and try again
    await fetchConversations();
    const data = await getConversations();
    const updated = data?.data?.find?.((c) => c.id === conversationId)
      || (Array.isArray(data) ? data.find((c) => c.id === conversationId) : null);

    if (updated) {
      await selectConversation(updated);
    }
  };

  return {
    conversations,

    selectedConversation,

    setSelectedConversation: selectConversation,
    openChat,
    selectConversationById,

    messages,

    loadingConversations,

    loadingMessages,

    handleSendMessage,

    appendMessage,

    refreshConversations: fetchConversations,
  };
}
