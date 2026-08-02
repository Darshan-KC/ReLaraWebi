import { apiFetch } from "./api";

export const setTyping = async (conversationId) => {
    await apiFetch(`/conversations/${conversationId}/typing`, {
        method: "POST",
    });
};

export const clearTyping = async (conversationId) => {
    await apiFetch(`/conversations/${conversationId}/typing`, {
        method: "DELETE",
    });
};

export const getTyping = async (conversationId) => {
    const response = await apiFetch(`/conversations/${conversationId}/typing`);
    return response;
};
