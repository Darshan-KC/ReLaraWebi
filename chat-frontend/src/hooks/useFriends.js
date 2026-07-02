import { useEffect, useState } from "react";
import {
  getUsers,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  getFriends,
} from "../services/friendship.service";

export default function useFriends() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  const [loading, setLoading] = useState(false);

  // Load all data
  const loadData = async () => {
    setLoading(true);

    try {
      const [u, r, f] = await Promise.all([
        getUsers(),
        getFriendRequests(),
        getFriends(),
      ]);

      setUsers(u);
      setRequests(r);
      setFriends(f);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Send request
  const addFriend = async (userId) => {
    await sendFriendRequest(userId);

    setUsers((prev) =>
      prev.filter((u) => u.id !== userId)
    );
  };

  // Accept request
  const acceptRequest = async (id) => {
    await acceptFriendRequest(id);

    setRequests((prev) =>
      prev.filter((r) => r.id !== id)
    );

    // reload friends
    const f = await getFriends();
    setFriends(f);
  };

  return {
    users,
    requests,
    friends,
    loading,
    addFriend,
    acceptRequest,
  };
}