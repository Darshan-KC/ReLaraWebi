export const API_URL = "http://localhost:8000/api";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  return data;
}