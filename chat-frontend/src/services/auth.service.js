import { apiFetch } from "./api";

export const AuthService = {
  login(payload) {
    return apiFetch("/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  register(payload) {
    return apiFetch("/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  logout() {
    return apiFetch("/logout", {
      method: "POST",
    });
  },

  me() {
    return apiFetch("/me");
  },
};