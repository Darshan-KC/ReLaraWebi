import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { TokenService } from "../services/token.service";
import { API_URL } from "../services/api";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "reverb",

  key: import.meta.env.VITE_REVERB_APP_KEY,

  wsHost: import.meta.env.VITE_REVERB_HOST,

  wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,

  forceTLS: false,

  enabledTransports: ["ws"],

  authEndpoint: `${API_URL}/broadcasting/auth`,

  auth: {
    headers: {
      Authorization: `Bearer ${TokenService.get() ?? ""}`,
    },
  },
});

export function setEchoAuthToken(token) {
  const headers = echo?.connector?.options?.auth?.headers;

  if (headers) {
    headers.Authorization = `Bearer ${token}`;
  }
}

console.log("[Echo] config:", {
  key: import.meta.env.VITE_REVERB_APP_KEY,
  host: import.meta.env.VITE_REVERB_HOST,
  port: import.meta.env.VITE_REVERB_PORT ?? 8080,
  authEndpoint: `${API_URL}/broadcasting/auth`,
  token: TokenService.get() ? "present" : "MISSING",
});

const pusher = echo.connector?.pusher;

if (pusher) {
  pusher.connection.bind("state_change", (states) => {
    console.log(
      "[Echo] state change:",
      states.previous,
      "->",
      states.current,
    );
  });

  pusher.connection.bind("connected", () => {
    console.log("[Echo] connected to Reverb, socket_id:", pusher.connection.socket_id);
  });

  pusher.connection.bind("disconnected", () => {
    console.log("[Echo] disconnected from Reverb");
  });

  pusher.connection.bind("error", (err) => {
    console.error("[Echo] websocket error:", err);
  });
}
export default echo;
