import Avatar from "../ui/Avatar";

export default function ChatSidebar({ users, onSelect }) {
  return (
    <div className="h-full overflow-y-auto">

      <div className="p-4 font-semibold border-b">
        Chats
      </div>

      {users.map((user) => (
        <div
          key={user.id}
          onClick={() => onSelect(user)}
          className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
        >
          <Avatar name={user.name} />
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">
              Last message...
            </p>
          </div>
        </div>
      ))}

    </div>
  );
}