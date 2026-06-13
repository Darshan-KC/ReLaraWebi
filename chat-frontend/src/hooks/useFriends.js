import { useEffect, useState } from "react";
import {
  getUsers,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  getFriends,
} from "../services/friendService";

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
    return ;

}