function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is missing`);
  }
  return value;
}

const BASE_URL = getEnv("NEXT_PUBLIC_API_URL");
const API_KEY  = getEnv("API_SECRET_KEY");

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
  return {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
  };
}

type FetchOptions = RequestInit & {
  next?: { revalidate?: number };
};

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {

  const { headers, ...rest } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      ...getHeaders(),
      ...(headers ?? {}),
    },

    ...(isDev
      ? { cache: "no-store" as RequestCache }
      : { next: { revalidate: 60 } }),

    ...rest,
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
    throw new Error(
      json.message ||
      json.error ||
      "API returned success:false"
    );
  }

  return json;
}

export async function apiGet<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {

  const response = await apiFetch<T>(path, options);

  return response.data;
}