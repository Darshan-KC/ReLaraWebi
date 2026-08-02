import { apiFetch } from "./api";

export const pinMessage = async (messageId) => {
    const response = await apiFetch(`/messages/${messageId}/pin`, {
        method: "POST",
    });

    return response;
};

export const unpinMessage = async (messageId) => {
    await apiFetch(`/messages/${messageId}/pin`, {
        method: "DELETE",
    });
};

export const getPinnedMessages = async (conversationId) => {
    const response = await apiFetch(`/conversations/${conversationId}/pinned`);
    return response;
};
