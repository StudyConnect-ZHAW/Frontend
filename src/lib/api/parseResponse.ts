/**
 * Parses a backend response and returns the result as a typed value.
 * Handles empty responses, plain text, and JSON formats gracefully.
 *
 * @template T - Expected response type
 * @param res - The Response object from fetch()
 * @returns Parsed response of type T
 * @throws Error if the response is not OK (non-2xx)
 */
export async function parseResponse<T>(res: Response): Promise<T> {
  // Handle 204 No Content explicitly — return undefined as T
  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();

  // Throw for non-2xx responses
  if (!res.ok) {
    throw new Error(text || 'Unknown error');
  }

  // Treat empty response as undefined
  if (!text) {
    return undefined as T;
  }

  try {
    // Try to parse as JSON
    return JSON.parse(text) as T;
  } catch {
    // Fallback for plain text or non-JSON payloads
    return text as unknown as T;
  }
}