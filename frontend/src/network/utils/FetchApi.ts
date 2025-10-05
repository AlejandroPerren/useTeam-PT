export type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface FetchOptions<TBody = unknown> {
  method?: FetchMethod // Méthods HTTP (por defecto GET)
  body?: TBody
  token?: string | null // Token JWT (if endpoint require Auth)
}

// Generic function reutilizable
export async function apiFetch<TResponse = unknown, TBody = unknown>(
  endpoint: string,
  options: FetchOptions<TBody> = {},
): Promise<{ ok: boolean; data: TResponse | null; error?: string }> {
  try {
    const res = await fetch(endpoint, {
      method: options.method || 'GET', // method ? get : method
      headers: {
        'Content-Type': 'application/json',
        // Send Token
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    })

    const json = await res.json().catch(() => null)

    if (!res.ok) {
      return {
        ok: false,
        data: null,
        error: json?.error || res.statusText,
      }
    }

    return { ok: true, data: json }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Fallo de red'
    return { ok: false, data: null, error: message }
  }
}
