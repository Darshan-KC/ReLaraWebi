import { apiFetch } from "./api";

export const getReactions = async (messageId) => {
    const response = await apiFetch(`/messages/${messageId}/reactions`);
    return response;
};

export const getDetailedReactions = async (messageId) => {
    const response = await apiFetch(`/messages/${messageId}/reactions/detailed`);
    return response;
};

export const toggleReaction = async (messageId, emoji) => {
    const response = await apiFetch(`/messages/${messageId}/reactions`, {
        method: "POST",
        body: JSON.stringify({ emoji }),
    });

    return {
        created: response !== null,
        data: response?.data ?? null,
    };
};

export const deleteReaction = async (messageId, reactionId) => {
    await apiFetch(`/messages/${messageId}/reactions/${reactionId}`, {
        method: "DELETE",
    });
};
