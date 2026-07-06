import { apiFetch } from "./api";

/**
 * Retrieves a list of all users.
 * @returns {Promise<User[]>}
 */
export const getUsers = async () => {
    const response = await api.get('/users');
    return response.data;
}

/** Retrieves a list of all friends for the current user.
 * @param {string} userId - The ID of the current user.
 * @returns {Promise<User[]>}
 */
export const sendFriendRequest = async (receiverId) => {
    const response = await api.post('/friend-requests', { receiverId });
    return response.data;
}

/**
 * Accepts a friend request.
 * @param {string} requestId - The ID of the friend request to accept.
 * @returns {Promise<any>}
 */
export const acceptFriendRequest = async (requestId) => {
    const response = await api.post(`/friend-requests/${requestId}/accept`);
    return response.data;
}

/**
 * Retrieves a list of all friends for the current user.
 * @returns {Promise<User[]>}
 */
export const getFriends = async () => {
  const res = await api.get("/friendships/friends");
  return res.data;
};

export const getFriendRequests = async () => {
  const res = await api.get("/friend-requests");
  return res.data;
};