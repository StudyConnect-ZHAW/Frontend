import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie');

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

    let shortName: string | undefined;
    if (email.endsWith('@students.zhaw.ch') || email.endsWith('@zhaw.ch')) {
      shortName = email.split('@')[0];
    } else {
      return NextResponse.json({ error: 'Invalid email domain' }, { status: 400 });
    }

    const startingAt = req.nextUrl.searchParams.get('startingAt') ?? new Date().toISOString().split('T')[0];

    const scheduleRes = await fetch(
      `https://api.apps.engineering.zhaw.ch/v1/schedules/students/${shortName}?days=7&startingAt=${startingAt}`,
      {
        headers: {
          'User-Agent': 'StudyConnect (https://github.com/StudyConnect-ZHAW)',
          Accept: 'application/json',
        },
      }
    );

    if (scheduleRes.status === 404) {
      console.warn(`🟡 No schedule found for ${startingAt} → likely semester break`);
      
      return NextResponse.json({ days: [] }); // return empty calendar
    }
      
    if (!scheduleRes.ok) {
      console.error(`ZHAW error (${scheduleRes.status}):`, await scheduleRes.text());
      
      return NextResponse.json({ error: 'Failed to fetch ZHAW calendar' }, { status: scheduleRes.status });
    }

    const schedule = await scheduleRes.json();
    
    return NextResponse.json(schedule);

  } catch (error) {
    console.error('Failed to load schedule:', error);

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}