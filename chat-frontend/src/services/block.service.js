import { apiFetch } from "./api";

export const blockUser = async (blockedUserId, reason) => {
    const response = await apiFetch("/blocked-users", {
        method: "POST",
        body: JSON.stringify({
            blocked_user_id: blockedUserId,
            reason: reason ?? null,
        }),
    });

    return response;
};

export const unblockUser = async (blockedUserId) => {
    const response = await apiFetch(`/blocked-users/${blockedUserId}`, {
        method: "DELETE",
    });

    return response;
};

export const getBlockedUsers = async () => {
    const response = await apiFetch("/blocked-users");
    return response.data;
};

export const isBlocked = async (userId) => {
    const response = await apiFetch(`/users/${userId}/is-blocked`);
    return response.is_blocked;
};

export const hasBlockedMe = async (userId) => {
    const response = await apiFetch(`/users/${userId}/has-blocked-me`);
    return response.has_blocked_me;
};
