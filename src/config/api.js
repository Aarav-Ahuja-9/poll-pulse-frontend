const rawUrl = import.meta.env.VITE_BACKEND_URL;

export const API_BASE_URL = rawUrl?.replace(/\/$/, "") || "";

export function apiUrl(path) {
  if (!API_BASE_URL) {
    throw new Error(
      "VITE_BACKEND_URL is not set. Add it to client/.env and restart the dev server.",
    );
  }
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Use for socket.io — same host as REST API */
export function getSocketUrl() {
  if (!API_BASE_URL) {
    console.warn(
      "[PollPulse] VITE_BACKEND_URL is missing — sockets and API calls will fail.",
    );
  }
  return API_BASE_URL;
}
