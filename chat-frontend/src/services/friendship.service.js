import api from './api';

export const sendFriendRequest = async (receiverId) => {
    const response = await api.post('/friend-requests', { receiverId });
    return response.data;
}

export const acceptFriendRequest = async (requestId) => {
    const response = await api.post(`/friend-requests/${requestId}/accept`);
    return response.data;
}