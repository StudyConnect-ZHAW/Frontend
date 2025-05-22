export type APIResponse<T> = {
  data: T | null;
  error: { message: string } | null;
};

export const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}v1`;

export function getRequestHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}

export async function parseResponse<T>(res: Response): Promise<T> {
  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || 'Unknown error');
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    // not JSON — likely a string message like "Group updated successfully."
    return text as unknown as T;
  }
}
 