export const openConversation = async (
  friendId
) => {
  const response = await api.post(
    "/conversations/open",
    {
      friend_id: friendId,
    }
  );

  return response.data.data;
};

export const getConversations = async () => {
  const response = await api.get("/conversations");

  return response.data.data;
}

export const getMessages = async (conversationId) => {
  const response = await api.get(`/conversations/${conversationId}/messages`);

  return response.data.data;
}

export const sendMessage = async (conversationId, message) => {
  const response = await api.post(
    `/conversations/${conversationId}/messages`,
    {
      message: message,
    }
  );

  return response.data.data;
}