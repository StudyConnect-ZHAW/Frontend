import type { User } from '@/types/user';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}v1`;

function getRequestHeaders(): HeadersInit {

  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',

  };
}

export async function updateUser(updatedData: Partial<User>): Promise<User | null> {
  const currentUser = await getCurrentUser();

  const res = await fetch(`${BASE_URL}/users`, {
    method: 'PUT',
    headers: getRequestHeaders(),
    body: JSON.stringify({
      ...updatedData,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? `Failed with status ${res.status}`);
  }

  return res.status === 204 ? null : await res.json();
}

export async function getCurrentUser(): Promise<User> {
  const res = await fetch('/api/me', {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to get current user: ${res.status}`);
  }

  return await res.json();
}