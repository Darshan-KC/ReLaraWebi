import { useEffect, useState } from "react";
import {
  getUsers,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  getFriends,
  getSentRequests,
} from "../services/friendship.service";

export default function useFriends() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);

    const [uResult, rResult, fResult, sResult] = await Promise.allSettled([
      getUsers(),
      getFriendRequests(),
      getFriends(),
      getSentRequests(),
    ]);

    if (uResult.status === "fulfilled") setUsers(uResult.value || []);
    if (rResult.status === "fulfilled") setRequests(rResult.value || []);
    if (fResult.status === "fulfilled") setFriends(fResult.value || []);
    if (sResult.status === "fulfilled") setSentRequests(sResult.value || []);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addFriend = async (userId) => {
    const friendship = await sendFriendRequest(userId);

    setSentRequests((prev) => [...prev, friendship]);
  };

  const acceptRequest = async (id) => {
    await acceptFriendRequest(id);

    setRequests((prev) => prev.filter((r) => r.id !== id));

    const f = await getFriends();
    setFriends(f.status === "fulfilled" ? f.value || [] : []);
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

  return {
    users,
    requests,
    friends,
    loading,
    addFriend,
    acceptRequest,
    getUserStatus,
  };
}
