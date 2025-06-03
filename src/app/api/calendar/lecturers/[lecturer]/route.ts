import { NextRequest, NextResponse } from 'next/server';

/**
 * Forwards a GET request to the external ZHAW Engineering API to fetch the schedule
 * for a specific lecturer shortName and date.
 * The lecturer is taken from the dynamic route segment `[lecturer]`.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ lecturer: string }> }) {
  const { lecturer } = await params;

  const rawDateStr = req.nextUrl.searchParams.get('startingAt') ?? new Date().toISOString().split('T')[0];
  const date = new Date(rawDateStr);
  const startingAt = date.toISOString().split('T')[0];

  const scheduleRes = await fetch(
    `https://api.apps.engineering.zhaw.ch/v1/schedules/lecturers/${lecturer}?startingAt=${startingAt}`,
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
}