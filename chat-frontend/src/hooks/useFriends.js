import { useEffect, useState } from "react";
import {
  getUsers,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  getFriends,
  getSentRequests,
  unfriend as unfriendApi,
} from "../services/friendship.service";

export default function useFriends() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([
      getUsers(),
      getFriendRequests(),
      getFriends(),
      getSentRequests(),
    ]).then(([uResult, rResult, fResult, sResult]) => {
      if (cancelled) return;

      if (uResult.status === "fulfilled") setUsers(uResult.value || []);
      if (rResult.status === "fulfilled") setRequests(rResult.value || []);
      if (fResult.status === "fulfilled") setFriends(fResult.value || []);
      if (sResult.status === "fulfilled") setSentRequests(sResult.value || []);

      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const addFriend = async (userId) => {
    const friendship = await sendFriendRequest(userId);

    setSentRequests((prev) => [...prev, friendship]);
  };

  const acceptRequest = async (id) => {
    const result = await acceptFriendRequest(id);

    setRequests((prev) => prev.filter((r) => r.id !== id));

    const f = await getFriends();
    setFriends(Array.isArray(f) ? f : []);

    return result.conversation;
  };

  const friendIds = new Set(
    friends.map((f) => f.sender?.id ?? f.receiver?.id).filter(Boolean)
  );

  const sentRequestIds = new Set(
    sentRequests.map((r) => r.receiver?.id).filter(Boolean)
  );

  const receivedRequestMap = new Map(
    requests.map((r) => [r.sender?.id, r.id]).filter(([id]) => id)
  );

  const getUserStatus = (userId) => {
    if (friendIds.has(userId)) return "friends";
    if (sentRequestIds.has(userId)) return "request_sent";
    if (receivedRequestMap.has(userId))
      return { status: "request_received", requestId: receivedRequestMap.get(userId) };
    return "none";
  };

  const removeFriend = async (friendshipId) => {
    await unfriendApi(friendshipId);

    setFriends((prev) => prev.filter((f) => f.id !== friendshipId));
  };

  return {
    users,
    requests,
    friends,
    sentRequests,
    loading,
    addFriend,
    acceptRequest,
    removeFriend,
    getUserStatus,
  };
}
