export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api';

async function readResponseBody(response: Response) {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  const text = await response.text();
  return text || null;
}

function resolveErrorMessage(body: unknown, fallback: string) {
  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message: unknown }).message;
    if (Array.isArray(message)) return message.join(', ');
    if (typeof message === 'string') return message;
  }
  return fallback;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Admin authentication header
  if (!headers.has('Authorization')) {
    headers.set('Authorization', 'Bearer admin-token');
  }
  if (!headers.has('x-admin-key')) {
    headers.set('x-admin-key', 'admin');
  }

  let response: Response;
  try {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
      ...options,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError('Unable to reach the Admin backend server.', 0, null);
  }

  const body = await readResponseBody(response);

  if (!response.ok) {
    throw new ApiError(
      resolveErrorMessage(body, response.statusText),
      response.status,
      body,
    );
  }

  return body as T;
}
