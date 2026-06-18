import useFriends from "../../hooks/useFriends";

export default function FriendRequests() {
  const { requests, acceptRequest } = useFriends();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        Friend Requests
      </h1>

      <div className="space-y-3">
        {requests.map((req) => (
          <div
            key={req.id}
            className="flex justify-between items-center p-3 bg-white rounded shadow"
          >
            <div>
              <p className="font-semibold">
                {req.sender.name}
              </p>
            </div>

            <button
              onClick={() => acceptRequest(req.id)}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Accept
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}