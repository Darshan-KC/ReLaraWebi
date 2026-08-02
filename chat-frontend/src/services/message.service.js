import { apiFetch } from "./api";

export const editMessage = async (messageId, body) => {
    const response = await apiFetch(`/messages/${messageId}`, {
        method: "PUT",
        body: JSON.stringify({ body }),
    });

    return response.data ?? response;
};

export const deleteMessage = async (messageId) => {
    await apiFetch(`/messages/${messageId}`, {
        method: "DELETE",
    });
};

export const restoreMessage = async (messageId) => {
    const response = await apiFetch(`/messages/${messageId}/restore`, {
        method: "POST",
    });

    return response.data ?? response;
};

export const getEditHistory = async (messageId) => {
    const response = await apiFetch(`/messages/${messageId}/edits`);
    return response;
};
