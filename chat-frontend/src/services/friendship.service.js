import { apiFetch } from "./api";

/**
 * Retrieves a list of all users.
 *
 * @async
 * @function getUsers
 * @returns {Promise<User[]>} A promise that resolves to an array of users.
 */
export const getUsers = async () => {
    const response = await apiFetch("/users");
    return response.data;
};

/**
 * Sends a friend request to another user.
 *
 * @async
 * @function sendFriendRequest
 * @param {string|number} receiverId - The ID of the user receiving the friend request.
 * @returns {Promise<any>} A promise that resolves to the created friend request.
 */
export const sendFriendRequest = async (receiverId) => {
    const response = await apiFetch("/friendships", {
        method: "POST",
        body: JSON.stringify({
            receiver_id: receiverId,
        }),
    });

    return response.data;
};

/**
 * Accepts a pending friend request.
 *
 * @async
 * @function acceptFriendRequest
 * @param {string|number} requestId - The ID of the friend request.
 * @returns {Promise<any>} A promise that resolves to the accepted friendship.
 */
export const acceptFriendRequest = async (friendshipId) => {
    const response = await apiFetch(`/friendships/${friendshipId}/accept`, {
        method: "POST",
    });

    return response;
};

/**
 * Retrieves all friends of the authenticated user.
 *
 * @async
 * @function getFriends
 * @returns {Promise<User[]>} A promise that resolves to an array of friends.
 */
export const getFriends = async () => {
    const response = await apiFetch("/friendships/friends");
    return response.data;
};

/**
 * Retrieves all pending friend requests for the authenticated user.
 *
 * @async
 * @function getFriendRequests
 * @returns {Promise<any[]>} A promise that resolves to an array of friend requests.
 */
export const getFriendRequests = async () => {
    const response = await apiFetch("/friend-requests");
    return response.data;
};

export const getSentRequests = async () => {
    const response = await apiFetch("/friendships/send-requests");
    return response.data;
};