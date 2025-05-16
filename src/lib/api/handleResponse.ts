export type APIResponse<T> = {
  data: T | null;
  error: { message: string } | null;
};

export async function handleResponse<T>(res: Response): Promise<T> {
  let json: APIResponse<T>;

  try {
    json = await res.json();
  } catch {
    throw new Error('Invalid JSON response');
  }

  if (res.ok && json.data !== null) {
    return json.data;
  }

  const msg = json.error?.message || `Request failed with status ${res.status}`;
  throw new Error(msg);
}