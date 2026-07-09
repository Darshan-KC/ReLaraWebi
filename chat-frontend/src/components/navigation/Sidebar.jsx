import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass =
    "block px-4 py-2 rounded-lg hover:bg-gray-200 transition";

  const activeClass = "bg-blue-100 text-blue-600 font-semibold";

  return (
    <aside className="w-64 bg-white shadow-md hidden md:block">
      
      <div className="p-6 font-bold text-xl">
        Chatverse
      </div>

      <nav className="space-y-2 px-4">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/chat"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Chat
        </NavLink>

        <NavLink
          to="/friends"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Friends
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Profile
        </NavLink>

      </nav>
    </aside>
  );
}