import { useCallback, useEffect, useState } from "react";

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

  // Fetch conversations function
  const fetchConversations = useCallback(async () => {
    try {
      setLoadingConversations(true);

      const data = await getConversations();

      setConversations(data);
    } finally {
      setLoadingConversations(false);
    }
  }, []);

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
      id: `temp-${Date.now()}`,
      body,
      sender_id: user.id,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const savedMessage = await sendMessage(selectedConversation.id, body);

      // Replace the temp message and drop any realtime echo of the saved
      // message (the sender's own socket also receives the broadcast), so the
      // saved message only ever appears once.
      setMessages((prev) => {
        const next = prev.filter(
          (msg) => msg.id !== tempMessage.id && msg.id !== savedMessage.id,
        );

        return [...next, savedMessage];
      });
    } catch (error) {
      // rollback
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));

      throw error;
    }
  };

  // Receive realtime message
  const appendMessage = useCallback((message) => {
    setMessages((prev) =>
      prev.some((m) => m.id === message.id) ? prev : [...prev, message],
    );
  }, []);

  // Open or find existing conversation with a friend
  const openChat = async (friendId) => {
    const conversation = await openConversation(friendId);

    await selectConversation(conversation);

    await fetchConversations();

    return conversation;
  };

  // Select a conversation by its ID (for pre-selecting after accept)
  const selectConversationById = useCallback(async (conversationId) => {
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
  }, [conversations, fetchConversations]);

  // Fetch conversations
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,

    selectedConversation,

    setSelectedConversation: selectConversation,
    openChat,
    selectConversationById,

    messages,
    setMessages,

    loadingConversations,

    loadingMessages,

    handleSendMessage,

    appendMessage,

    refreshConversations: fetchConversations,
  };
}
