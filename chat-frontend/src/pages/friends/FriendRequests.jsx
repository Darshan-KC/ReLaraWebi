import { useState } from "react";
import useFriends from "../../hooks/useFriends";

export default function FriendRequests() {
  const { requests, sentRequests, acceptRequest, loading } = useFriends();
  const [activeTab, setActiveTab] = useState("received");
  const [acceptingId, setAcceptingId] = useState(null);

  const handleAccept = async (id) => {
    setAcceptingId(id);
    try {
      await acceptRequest(id);
    } finally {
      setAcceptingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-500">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Friend Requests
        </h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-200 rounded-lg p-1 mb-6 w-fit">
          <button
            onClick={() => setActiveTab("received")}
            className={`px-5 py-2 rounded-md font-medium text-sm transition ${
              activeTab === "received"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Received
            {requests.length > 0 && (
              <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {requests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`px-5 py-2 rounded-md font-medium text-sm transition ${
              activeTab === "sent"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Sent
            {sentRequests.length > 0 && (
              <span className="ml-2 bg-gray-500 text-white text-xs px-2 py-0.5 rounded-full">
                {sentRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* Received Requests */}
        {activeTab === "received" && (
          <div className="grid gap-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center text-lg font-bold">
                    {req.sender?.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg text-gray-800">
                      {req.sender?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {req.sender?.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleAccept(req.id)}
                  disabled={acceptingId === req.id}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg font-medium transition"
                >
                  {acceptingId === req.id ? "Accepting..." : "Accept"}
                </button>
              </div>
            ))}

            {requests.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
                <p className="text-lg">No pending requests.</p>
                <p className="text-sm mt-2">
                  When someone adds you as a friend, their request will appear here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Sent Requests */}
        {activeTab === "sent" && (
          <div className="grid gap-4">
            {sentRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
                    {req.receiver?.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg text-gray-800">
                      {req.receiver?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {req.receiver?.email}
                    </p>
                  </div>
                </div>

                <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-medium text-sm">
                  Pending
                </span>
              </div>
            ))}

            {sentRequests.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
                <p className="text-lg">No sent requests.</p>
                <p className="text-sm mt-2">
                  Requests you send to other users will appear here.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
