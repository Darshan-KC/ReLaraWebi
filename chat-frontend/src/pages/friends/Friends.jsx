import useFriends from "../../hooks/useFriends";

export default function Friends() {
  const { friends } = useFriends();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        My Friends
      </h1>

      <div className="space-y-3">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="p-3 bg-white rounded shadow"
          >
            <p className="font-semibold">
              {friend.name}
              <button
                onClick={() => openChat(friend)}
              >
                Message
              </button>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}