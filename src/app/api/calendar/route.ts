import { headers } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Extract cookie header from the request
    const cookieHeader = (await headers()).get('cookie');

    // Parse JWT token from cookie header
    const token = cookieHeader
      ?.split(';')
      .find((c) => c.trim().startsWith('access_token='))
      ?.split('=')[1];

    // Validate token existence
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Decode token to extract user ID
    const decoded = jwtDecode<{ oid: string }>(token);
    const userId = decoded.oid;

    // Fetch user details from internal API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
    const userRes = await fetch(`${apiUrl}v1/users/${userId}`);

    if (!userRes.ok) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = await userRes.json();

    // Extract and validate email from user object
    const email = user.email?.toLowerCase() ?? '';
    let shortName: string | undefined;

    if (email.endsWith('@students.zhaw.ch') || email.endsWith('@zhaw.ch')) {
      shortName = email.split('@')[0];
    } else {
      console.warn(`Email domain not supported: ${email}`);

      return NextResponse.json({ error: 'Invalid email domain' }, { status: 400 });
    }

    // Fetch student schedule from ZHAW API using shortName
    const scheduleRes = await fetch(
      `https://api.apps.engineering.zhaw.ch/v1/schedules/students/${shortName}`,
      {
        headers: {
          'User-Agent': 'StudyConnect (https://github.com/StudyConnect-ZHAW)',
          Accept: 'application/json',
        },
      }
    );

    // Check if fetching schedule was successful
    if (!scheduleRes.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch ZHAW calendar' },
        { status: scheduleRes.status }
      );
    }

    const schedule = await scheduleRes.json();

    // Return the fetched schedule
    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Failed to load schedule:', error);

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
