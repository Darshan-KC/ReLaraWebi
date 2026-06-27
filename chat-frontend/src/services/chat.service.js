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