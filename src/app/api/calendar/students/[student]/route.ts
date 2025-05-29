import { NextRequest, NextResponse } from 'next/server';

/*
 * API Route: /api/calendar
 * Fetches the ZHAW schedule for authenticated users with a valid ZHAW email.
 * Requires a valid JWT in the 'access_token' cookie.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ student: string }> }) {
  
  // TODO: request to get all students and all lectureres cache it in a list, 
  // look if shortname part of student, or part of lecturer list, if neither dont call api !

  // TODO: separate api calls and logic dont do everything in one file 
  // (hooks, lib/api, handlers, calendar.ts with mapZhawDaysToEvents)
  
  try {
    console.log(req);
    const { student }= await params;

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
    // eslint-disable-next-line no-console
    console.error('API-Error:', error);

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}