import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

/*
 * API Route: /api/calendar
 * Fetches the ZHAW schedule for authenticated users with a valid ZHAW email.
 * Requires a valid JWT in the 'access_token' cookie.
 */
export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie');

    // Extract JWT from cookies
    const token = cookieHeader
      ?.split(';')
      .find((c) => c.trim().startsWith('access_token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwtDecode<{ oid: string }>(token);
    const userId = decoded.oid;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
    const userRes = await fetch(`${apiUrl}v1/users/${userId}`);

    if (!userRes.ok) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = await userRes.json();
    const email = user.email?.toLowerCase() ?? '';

    // Extract the username (before @); must match the ZHAW shortname used in the calendar system
    let shortName: string | undefined;

    if (email.includes('@')) {
      shortName = email.split('@')[0];
    } else {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Extract params
    const rawDateStr = req.nextUrl.searchParams.get('startingAt') ?? new Date().toISOString().split('T')[0];
    const view = req.nextUrl.searchParams.get('view') ?? '';
    const date = new Date(rawDateStr);

    // ZHAW weeks start on Monday but API returns Sunday, shift only for non-day views
    if (view !== 'timeGridDay') {
      date.setDate(date.getDate() + 1);
    }

    const startingAt = date.toISOString().split('T')[0];

    const scheduleRes = await fetch(
      `https://api.apps.engineering.zhaw.ch/v1/schedules/students/${shortName}?startingAt=${startingAt}`,
      {
        headers: {
          'User-Agent': 'StudyConnect (https://github.com/StudyConnect-ZHAW)',
          Accept: 'application/json',
        },
      }
    );

    if (scheduleRes.status === 404) {

      return NextResponse.json({ days: [] });
    }

    if (!scheduleRes.ok) {

      return NextResponse.json({ error: 'Failed to fetch ZHAW calendar' }, { status: scheduleRes.status });
    }

    const schedule = await scheduleRes.json();

    return NextResponse.json(schedule);

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('API-Error:', error);

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}