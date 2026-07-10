import { apiFetch } from "./api";

/**
 * Opens an existing conversation with a friend or creates a new one.
 *
 * @async
 * @function openConversation
 * @param {string|number} friendId - The ID of the friend.
 * @returns {Promise<Object>} A promise that resolves to the conversation.
 */
export const openConversation = async (friendId) => {
    const response = await apiFetch("/conversations/open", {
        method: "POST",
        body: JSON.stringify({
            friend_id: friendId,
        }),
    });

    return response.data;
};

/**
 * Retrieves all conversations for the authenticated user.
 *
 * @async
 * @function getConversations
 * @returns {Promise<Object[]>} A promise that resolves to an array of conversations.
 */
export const getConversations = async () => {
    const response = await apiFetch("/conversations");

    return response.data;
};

/**
 * Retrieves all messages for a specific conversation.
 *
 * @async
 * @function getMessages
 * @param {string|number} conversationId - The ID of the conversation.
 * @returns {Promise<Object[]>} A promise that resolves to an array of messages.
 */
export const getMessages = async (conversationId) => {
    const response = await apiFetch(`/conversations/${conversationId}/messages`);

    return response.data;
};

/**
 * Sends a new message to a conversation.
 *
 * @async
 * @function sendMessage
 * @param {string|number} conversationId - The ID of the conversation.
 * @param {string} message - The message content.
 * @returns {Promise<Object>} A promise that resolves to the newly created message.
 */
export const sendMessage = async (conversationId, message) => {
    const response = await apiFetch(`/conversations/${conversationId}/messages`, {
        method: "POST",
        body: JSON.stringify({
            message,
        }),
    });

    return response.data;
};