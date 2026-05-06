import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";

// Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/profile/Profile";
import Chat from "../pages/chat/Chat";

// Auth
import { useAuth } from "../hooks/useAuth";

// 🔒 Protected Route
function PrivateRoute({ children }) {
  const { user } = useAuth();

  return user ? children : <Navigate to="/login" />;
}

// 🔓 Public Route (prevent logged-in access)
function PublicRoute({ children }) {
  const { user } = useAuth();

  return !user ? children : <Navigate to="/" />;
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Private */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}