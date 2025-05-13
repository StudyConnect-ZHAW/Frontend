import { headers } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const cookieHeader = (await headers()).get('cookie');
    const token = cookieHeader
      ?.split(';')
      .find((c) => c.trim().startsWith('access_token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwtDecode<{ oid: string }>(token);
    const userId = decoded.oid;

    // get user infos
    const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
    const userRes = await fetch(`${apiUrl}v1/users/${userId}`);

    if (!userRes.ok) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = await userRes.json();

    // TODO: find better solution for creation of shortName sometimes it can contain numbers
    // create shortname for api request
    const shortName = (
      (user.lastName || '').substring(0, 5) +
      (user.firstName || '').substring(0, 3)
    ).toLowerCase();

    // get schedule from zhaw api
    const scheduleRes = await fetch(
      `https://api.apps.engineering.zhaw.ch/v1/schedules/students/${shortName}`,
      {
        headers: {
          'User-Agent': 'StudyConnect (https://github.com/StudyConnect-ZHAW)',
          'Accept': 'application/json',
        },
      }
    );

    if (!scheduleRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch ZHAW calendar' }, { status: scheduleRes.status });
    }

    const schedule = await scheduleRes.json();

    return NextResponse.json(schedule);
  } catch (err: any) {
    console.error('Failed to load schedule:', err);

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}