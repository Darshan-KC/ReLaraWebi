import Avatar from "../ui/Avatar";

export default function ChatHeader({ user }) {
  if (!user) return null;

  return (
    <div className="flex items-center gap-3 p-4 border-b">
      <Avatar name={user.name} />
      <div>
        <p className="font-semibold">{user.name}</p>
        <p className="text-xs text-green-500">Online</p>
      </div>
    </div>
  );
}