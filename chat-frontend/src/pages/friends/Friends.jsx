import { Link } from "react-router-dom";
import useFriends from "../../hooks/useFriends";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../../components/ui/Avatar";

export default function Friends() {
  const { friends } = useFriends();
  const { user } = useAuth();

  const getOther = (friendship) =>
    friendship.sender?.id === user?.id
      ? friendship.receiver
      : friendship.sender;

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

          <div className="flex gap-3">
            <Link
              to="/friend-requests"
              className="bg-white hover:bg-gray-50 text-gray-700 font-medium px-5 py-2.5 rounded-lg shadow-sm border border-gray-200 transition duration-200"
            >
              Requests
            </Link>
            <Link
              to="/find-friends"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-md transition duration-200"
            >
              + Add Friend
            </Link>
          </div>
        </div>

        {/* Friends List */}
        <div className="grid gap-4">
          {friends.map((friend) => {
            const other = getOther(friend);
            return (
              <div
                key={friend.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Avatar name={other?.name} size="lg" />
                  <div>
                    <h2 className="font-semibold text-lg text-gray-800">
                      {other?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {other?.email}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

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
