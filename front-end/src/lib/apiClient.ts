const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  // Admin calls go through the local Next.js proxy, which attaches the
  // logged-in admin's JWT server-side — the browser never sees it.
  const isAdmin = endpoint.startsWith("/admin");
  const url = isAdmin ? `/api${endpoint}` : `${API_URL}${endpoint}`;

  const res = await fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(isAdmin ? {} : { "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "" }),
      ...(options.headers || {}),
    },
    body: options.body ? options.body : undefined,
    credentials: isAdmin ? "include" : "same-origin",
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "API request failed");
  }

  return res.json();
}
