import Sidebar from "../navigation/Sidebar";
import Navbar from "../navigation/Navbar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex flex-col flex-1">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}