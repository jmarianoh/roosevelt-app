export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  // Fastify rechaza con 400 un `application/json` sin cuerpo, y FormData define su propio tipo.
  const hasJsonBody = Boolean(init.body) && !(init.body instanceof FormData);

  const response = await fetch(`/api${path}`, {
    ...init,
    credentials: 'same-origin',
    headers: {
      ...(hasJsonBody ? { 'content-type': 'application/json' } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw Error(detail.error || 'No se pudo completar la acción.');
  }

  return response.json();
}

export function errorMessage(error: unknown): string {
  return (error as Error).message;
}
