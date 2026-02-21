const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include", // important for auth cookies
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => null)
    throw new Error(error?.error || "Something went wrong")
  }

  return res.json()
}

export const messageApi = {
  create: (content: string) =>
    apiFetch("/message", {
      method: "POST",
      body: JSON.stringify({ content }),
    }),

  getById: (id: number) =>
    apiFetch(`/message/${id}`, {
      method: "GET",
    }),
  delete: (id: number) =>
    apiFetch(`/message/${id}`, {
      method: "DELETE",
    }),
}

export const userApi = {
  getUserMessage: (username: string, cursor?: string) => {
    const query = new URLSearchParams({
      limit: "5",
      ...(cursor ? { cursor } : {}),
    }).toString()

    return apiFetch(`/users/${username}/messages?${query}`, {
      method: "GET",
    })
  },
}

