import { useState, useEffect } from "react";
import { AuthService } from "../services/auth.service";
import { TokenService } from "../services/token.service";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => !!TokenService.get());

  useEffect(() => {

    if (!loading) return;

    AuthService.me()
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        TokenService.remove();
      })
      .finally(() => {
        setLoading(false);
      });

  }, [loading]);

  const login = async (credentials) => {

    const data = await AuthService.login(credentials);

    console.log("Login successful:", data);

    TokenService.set(data.token);

    setUser(data.user);
  };

  const register = async (payload) => {

    const data = await AuthService.register(payload);

    TokenService.set(data.token);

    setUser(data.user);
  };

  const updateProfile = async (payload) => {
    const data = await AuthService.updateProfile(payload);
    setUser(data.user);
  };

  const logout = async () => {

    try {
      await AuthService.logout();
    } catch {
      /* ignore network errors on logout */
    }

    TokenService.remove();

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}