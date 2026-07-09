import useFriends from "../../hooks/useFriends";
import { Link } from "react-router-dom";

export default function Friends() {
  const { friends } = useFriends();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              My Friends
            </h1>
            <p className="text-gray-500">
              {friends.length} {friends.length === 1 ? "Friend" : "Friends"}
            </p>
          </div>

          <Link
            // onClick={() => console.log("Add Friend clicked")}
            to="/find-friends"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-md transition duration-200"
          >
            + Add Friend
          </Link>
        </div>

        {/* Friends List */}
        <div className="grid gap-4">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
                  {friend.name.charAt(0).toUpperCase()}
                </div>

                {/* Friend Info */}
                <div>
                  <h2 className="font-semibold text-lg text-gray-800">
                    {friend.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Friend
                  </p>
                </div>
              </div>

              {/* Message Button */}
              <button
                onClick={() => openChat(friend)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition"
              >
                Message
              </button>
            </div>
          ))}

          {friends.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
              <p className="text-lg">No friends yet.</p>
              <p className="text-sm mt-2">
                Click <strong>Add Friend</strong> to start connecting.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}