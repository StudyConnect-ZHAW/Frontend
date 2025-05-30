import { NextRequest, NextResponse } from 'next/server';

/**
 * Forwards a GET request to the external ZHAW Engineering API to fetch the schedule
 * for a specific student shortName and date.
 * The student is taken from the dynamic route segment `[student]`.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ student: string }> }) {
  try {
    console.log(req);
    const { student }= await params;

    // Extract params
    const rawDateStr = req.nextUrl.searchParams.get('startingAt') ?? new Date().toISOString().split('T')[0];
    const date = new Date(rawDateStr);
    const startingAt = date.toISOString().split('T')[0];

    console.log("starting at:" + startingAt);

    const scheduleRes = await fetch(
      `https://api.apps.engineering.zhaw.ch/v1/schedules/students/${student}?startingAt=${startingAt}`,
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
    console.error('API-Error:', error);

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}