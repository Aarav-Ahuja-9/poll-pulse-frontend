const rawUrl = import.meta.env.VITE_BACKEND_URL;
export const API_BASE_URL = rawUrl?.replace(/\/$/, "") || "";

const AUTH_TIMEOUT_MS = 90_000;

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Dev: same-origin /api → Vite proxy → backend (no CORS issues)
  if (import.meta.env.DEV) {
    return normalizedPath;
  }

  if (!API_BASE_URL) {
    throw new Error(
      "VITE_BACKEND_URL is not set. Add it to client/.env and rebuild/restart.",
    );
  }
  return `${API_BASE_URL}${normalizedPath}`;
}

/** Socket.io must connect to the real backend host, not the Vite dev server */
export function getSocketUrl() {
  if (!API_BASE_URL) {
    console.warn("[PollPulse] VITE_BACKEND_URL missing — sockets disabled.");
    return "http://localhost:5001";
  }
  return API_BASE_URL;
}

export function getAuthErrorMessage(err) {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.message?.includes("VITE_BACKEND_URL")) return err.message;
  if (err.code === "ECONNABORTED") {
    return "Server is still waking up (free tier). Wait 30–60 seconds and try again.";
  }
  if (!err.response) {
    if (import.meta.env.DEV) {
      return "Cannot reach the API. Restart the dev server (npm run dev) and check client/.env has VITE_BACKEND_URL.";
    }
    return "Cannot reach the API. Set VITE_BACKEND_URL in your hosting dashboard and redeploy the frontend.";
  }
  return "Something went wrong. Please try again.";
}

export const authRequestConfig = { timeout: AUTH_TIMEOUT_MS };
