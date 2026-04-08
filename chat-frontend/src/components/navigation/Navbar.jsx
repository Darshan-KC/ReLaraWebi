import Dropdown from "./overlay/Dropdown";
import Avatar from "./ui/Avatar";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow px-6 py-3 flex justify-between items-center">

      {/* Left */}
      <h1 className="font-semibold text-lg">
        Dashboard
      </h1>

      {/* Right */}
      <Dropdown
        trigger={
          <div className="cursor-pointer flex items-center gap-2">
            <Avatar name={user?.name} />
            <span className="text-sm">{user?.name}</span>
          </div>
        }
      >
        <button
          onClick={logout}
          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
        >
          Logout
        </button>
      </Dropdown>

    </header>
  );
}