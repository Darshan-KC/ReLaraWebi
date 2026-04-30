import { users, chats, messages } from "../index";

// Get chats for logged-in user
export const getUserChats = (userId) => {
  return chats.map((chat) => {
    const otherUserId = chat.participants.find(
      (id) => id !== userId
    );

    const otherUser = users.find(
      (user) => user.id === otherUserId
    );

    return {
      ...chat,
      user: otherUser,
    };
  });
};

// Get messages for a chat
export const getMessagesByChat = (chatId) => {
  return messages.filter((msg) => msg.chat_id === chatId);
};