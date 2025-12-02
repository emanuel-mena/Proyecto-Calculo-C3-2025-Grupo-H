// src/lib/api/httpClient.ts

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE || "http://localhost:8000";

/**
 * Error estándar para respuestas no-OK del backend.
 */
export class ApiError extends Error {
  status: number;
  detail?: unknown;

  constructor(message: string, status: number, detail?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

/**
 * Helper genérico para hacer requests JSON al backend.
 */
export async function apiFetchJson<TResponse, TBody = unknown>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: TBody;
    signal?: AbortSignal;
  } = {}
): Promise<TResponse> {
  const { method = "GET", body, signal } = options;

  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    method,
    signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data: unknown = null;

  try {
    // Intentamos parsear JSON siempre que haya contenido
    if (response.status !== 204) {
      data = await response.json();
    }
  } catch {
    // Si no hay JSON, lo dejamos como null y seguimos
    data = null;
  }

  if (!response.ok) {
    const message =
      (data && (data as any).detail) ||
      `Error ${response.status} al llamar a ${path}`;
    throw new ApiError(String(message), response.status, data ?? undefined);
  }

  return data as TResponse;
}
