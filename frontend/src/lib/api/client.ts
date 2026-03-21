function getEnv(name: string, fallback?: string): string {
  const value = process.env[name];

  if (!value) {
    if (fallback !== undefined) return fallback;
    console.error(`${name} environment variable is missing`);
    return "";
  }

  return value;
}

const BASE_URL = getEnv("NEXT_PUBLIC_API_URL");
const API_KEY = getEnv("API_SECRET_KEY");

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

/**
 * Fallback response when API fails
 * Ensures frontend never crashes
 */
function fallbackResponse<T>(message: string): ApiResponse<T> {
  return {
    success: false,
    data: null as T,
    message,
    error: message,
  };
}

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout = 5000
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Retry failed API calls
 */
async function retryFetch<T>(
  fn: () => Promise<ApiResponse<T>>,
  retries = 2
): Promise<ApiResponse<T>> {
  for (let i = 0; i <= retries; i++) {
    const res = await fn();
    if (res.success) return res;
  }
  return fallbackResponse<T>("Failed after retries");
}

/**
 * Core API fetch function
 */
export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { headers, ...rest } = options;

  const execute = async (): Promise<ApiResponse<T>> => {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}${path}`, {
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
        return fallbackResponse<T>(message);
      }

      let json: ApiResponse<T>;
      try {
        json = await res.json();
      } catch {
        return fallbackResponse<T>("Invalid JSON response");
      }

      if (!json.success) {
        return fallbackResponse<T>(
          json.message || json.error || "API returned success:false"
        );
      }

      return json;
    } catch (err: any) {
      return fallbackResponse<T>(
        err.name === "AbortError" ? "Request timeout" : "Network error"
      );
    }
  };

  return retryFetch(execute, 2);
}

/**
 * GET request
 * Always returns data (never null)
 */
export async function apiGet<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await apiFetch<T>(path, options);
  return response.success && response.data ? response.data : ([] as unknown as T);
}

/**
 * POST request
 */
export async function apiPost<T>(
  path: string,
  body: any,
  options: FetchOptions = {}
): Promise<T> {
  const response = await apiFetch<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
    ...options,
  });

  return response.success && response.data ? response.data : ({} as T);
}

/**
 * PUT request
 */
export async function apiPut<T>(
  path: string,
  body: any,
  options: FetchOptions = {}
): Promise<T> {
  const response = await apiFetch<T>(path, {
    method: "PUT",
    body: JSON.stringify(body),
    ...options,
  });

  return response.success && response.data ? response.data : ({} as T);
}

/**
 * DELETE request
 */
export async function apiDelete<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await apiFetch<T>(path, {
    method: "DELETE",
    ...options,
  });

  return response.success && response.data ? response.data : ({} as T);
}