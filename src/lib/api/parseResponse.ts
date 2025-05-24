export async function parseResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || 'Unknown error');
  }

  if (!text) {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    // Fallback for plain text responses
    return text as unknown as T;
  }
}