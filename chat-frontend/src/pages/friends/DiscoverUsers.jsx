import { useState } from "react";
import useFriends from "../../hooks/useFriends";

export default function DiscoverUsers() {
  const { users, loading, addFriend, acceptRequest, getUserStatus } =
    useFriends();
  const [search, setSearch] = useState("");
  const [sendingId, setSendingId] = useState(null);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  const handleAdd = async (userId) => {
    setSendingId(userId);
    try {
      await addFriend(userId);
    } finally {
      setSendingId(null);
    }
  };

  const handleAccept = async (requestId) => {
    setSendingId(requestId);
    try {
      await acceptRequest(requestId);
    } finally {
      setSendingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Discover Users</h1>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {users.length === 0
            ? "No other users found."
            : "No users match your search."}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((user) => {
            const status = getUserStatus(user.id);

            return (
              <div
                key={user.id}
                className="flex justify-between items-center p-4 bg-white rounded-lg shadow border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div>
                  {status === "friends" && (
                    <span className="px-3 py-1 text-sm text-green-700 bg-green-100 rounded-full">
                      Friends
                    </span>
                  )}

                  {status === "request_sent" && (
                    <span className="px-3 py-1 text-sm text-yellow-700 bg-yellow-100 rounded-full">
                      Request Sent
                    </span>
                  )}

                  {status?.status === "request_received" && (
                    <button
                      onClick={() => handleAccept(status.requestId)}
                      disabled={sendingId === status.requestId}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-sm rounded-full font-medium transition"
                    >
                      {sendingId === status.requestId
                        ? "Accepting..."
                        : "Accept Request"}
                    </button>
                  )}

                  {status === "none" && (
                    <button
                      onClick={() => handleAdd(user.id)}
                      disabled={sendingId === user.id}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm rounded-full font-medium transition"
                    >
                      {sendingId === user.id ? "Sending..." : "Add Friend"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
