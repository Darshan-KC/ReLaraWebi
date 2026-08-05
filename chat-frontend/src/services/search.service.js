import { apiFetch } from "./api";

const buildQuery = (params) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, value);
        }
    });

    const qs = query.toString();

    return qs ? `?${qs}` : "";
};

export const searchMessages = async (conversationId, params = {}) => {
    const response = await apiFetch(
        `/conversations/${conversationId}/messages/search${buildQuery(params)}`
    );

    return response.data ?? response;
};

export const searchGlobalMessages = async (params = {}) => {
    const response = await apiFetch(`/messages/search${buildQuery(params)}`);
    return response.data ?? response;
};

export const searchConversations = async (params = {}) => {
    const response = await apiFetch(`/conversations/search${buildQuery(params)}`);
    return response.data ?? response;
};

export const getSuggestions = async (conversationId, q, limit = 10) => {
    const response = await apiFetch(
        `/conversations/${conversationId}/messages/suggestions${buildQuery({ q, limit })}`
    );

    return response;
};
