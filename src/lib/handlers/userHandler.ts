import type { User } from '@/types/user';
import { parseResponse } from '@/lib/api/parseResponse';

export async function updateUser(data: User): Promise<void> {
  const res = await fetch(`/api/users`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  return parseResponse<void>(res);
}

export async function getCurrentUser(): Promise<User> {
  const res = await fetch('/api/me', {
    method: 'GET',
  });

  return parseResponse<User>(res);
}