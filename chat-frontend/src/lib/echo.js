import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { TokenService } from "../services/token.service";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "reverb",

  key: import.meta.env.VITE_REVERB_APP_KEY,

  wsHost: import.meta.env.VITE_REVERB_HOST,

  wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,

  forceTLS: false,

  enabledTransports: ["ws"],

  authEndpoint: "http://127.0.0.1:8000/api/broadcasting/auth",

  auth: {
    headers: {
      Authorization: `Bearer ${TokenService.get()}`,
    },
  },
});
export default echo;