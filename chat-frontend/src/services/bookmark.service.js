import { apiFetch } from "./api";

export const bookmarkMessage = async (messageId, notes) => {
    const response = await apiFetch(`/messages/${messageId}/bookmark`, {
        method: "POST",
        body: JSON.stringify({ notes: notes ?? null }),
    });

    return response.data ?? response;
};

export const unbookmarkMessage = async (messageId) => {
    await apiFetch(`/messages/${messageId}/bookmark`, {
        method: "DELETE",
    });
};

export const checkBookmark = async (messageId) => {
    const response = await apiFetch(`/messages/${messageId}/bookmark/check`);
    return response.is_bookmarked;
};

export const getBookmarks = async () => {
    const response = await apiFetch("/bookmarks");
    return response.data ?? response;
};

export const getConversationBookmarks = async (conversationId) => {
    const response = await apiFetch(`/conversations/${conversationId}/bookmarks`);
    return response.data ?? response;
};
