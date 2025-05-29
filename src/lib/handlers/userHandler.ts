import type { User, UserUpdateData } from '@/types/user';
import { parseResponse } from '@/lib/api/parseResponse';

/**
 * Sends a PUT request to the Next.js API route `/api/users` to update the current user's profile.
 * This server-side route handler proxies the request to the actual backend API.
 *
 * @param data - The updated user object
 */
export async function updateUser(data: UserUpdateData): Promise<void> {
  const res = await fetch(`/api/users`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  return parseResponse<void>(res);
}

/**
 * Fetches the current user's profile via the Next.js API route `/api/users/me`.
 * The route handler decodes the access token and forwards the request to the backend.
 *
 * @returns The authenticated user's profile
 */
export async function getCurrentUser(): Promise<User> {
  const res = await fetch('/api/users/me', {
    method: 'GET',
  });

  return parseResponse<User>(res);
}