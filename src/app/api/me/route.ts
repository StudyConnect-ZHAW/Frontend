import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

/**
 * Forwards a GET request to the backend to retrieve the current user's information.
 * The user ID is extracted by decoding the access token from the cookie.
 * This route is used by components that need information of the current user but don't
 * have access the current user's id.
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwtDecode<{ oid: string }>(token);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL!;

    const res = await fetch(`${apiUrl}v1/users/${decoded.oid}`);

    if (!res.ok) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = await res.json();

    return NextResponse.json(user);
  } catch (err) {
    console.error('Failed to decode token:', err);

    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }
}