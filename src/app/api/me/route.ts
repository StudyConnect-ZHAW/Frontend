import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {jwtDecode } from 'jwt-decode';

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