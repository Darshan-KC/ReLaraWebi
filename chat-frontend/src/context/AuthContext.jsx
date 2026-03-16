import { createContext, useState, useEffect } from "react";
import { AuthService } from "../services/auth.service";
import { TokenService } from "../services/token.service";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = TokenService.get();

  useEffect(() => {

    if (!token) {
      setLoading(false);
      return;
    }

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

  }, []);

  const login = async (credentials) => {

    const data = await AuthService.login(credentials);

    TokenService.set(data.token);

    setUser(data.user);
  };

  const register = async (payload) => {

    const data = await AuthService.register(payload);

    TokenService.set(data.token);

    setUser(data.user);
  };

  const logout = async () => {

    try {
      await AuthService.logout();
    } catch {}

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}