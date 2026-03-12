// src/lib/api/client.ts

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const isDev = process.env.NODE_ENV === "development";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

function getHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const apiKey =
    process.env.API_SECRET_KEY ||
    process.env.NEXT_PUBLIC_API_SECRET_KEY;

  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }

  return headers;
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { next?: { revalidate?: number } }
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${path}`;

  // In development: always hit the backend (no cache)
  // In production: revalidate every 60s
  const cacheOptions = isDev
    ? { cache: "no-store" as RequestCache }
    : { next: { revalidate: 60, ...options?.next } };

  const res = await fetch(url, {
    headers: {
      ...getHeaders(),
      ...options?.headers,
    },
    ...cacheOptions,
    ...options,
  });

  if (!res.ok) {
    let message = `API error ${res.status}`;
    try {
      const err = await res.json();
      message = err.message || err.error || message;
    } catch {}
    throw new Error(message);
  }

  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    throw new Error(json.message || json.error || "API returned success: false");
  }

  return json;
}

export async function apiGet<T>(
  path: string,
  options?: RequestInit & { next?: { revalidate?: number } }
): Promise<T> {
  const response = await apiFetch<T>(path, options);
  return response.data;
}