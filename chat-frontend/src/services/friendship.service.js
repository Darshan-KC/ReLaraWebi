import api from './api';

export const sendFriendRequest = async (receiverId) => {
    const response = await api.post('/friend-requests', { receiverId });
}