import useFriends from "../../hooks/useFriends";

export default function DiscoverUsers() {
  const { users, addFriend, loading } = useFriends();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        Discover Users
      </h1>

      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center p-3 bg-white rounded shadow"
          >
            <div>
              <p className="font-semibold">
                {user.name}
              </p>
              <p className="text-sm text-gray-500">
                {user.email}
              </p>
            </div>

            <button
              onClick={() => addFriend(user.id)}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Add Friend
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}