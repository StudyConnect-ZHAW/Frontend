import { NextResponse } from 'next/server';

/**
 * Forwards a GET request to the external ZHAW Engineering API to fetch all lecturer shortNames.
 * This route acts as a proxy, adding necessary headers and passing the data back to the frontend.
 */
export async function GET() {

  try {

    const lecturersRes = await fetch(
      `https://api.apps.engineering.zhaw.ch/v1/schedules/students/`,
      {
        headers: {
          'User-Agent': 'StudyConnect (https://github.com/StudyConnect-ZHAW)',
          Accept: 'application/json',
        },
      }
    );

    if (!lecturersRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch ZHAW calendar' }, { status: lecturersRes.status });
    }

    const lecturers = await lecturersRes.json();
    console.log("Lecturers: " + lecturers);

    return NextResponse.json(lecturers);

  } catch (error) {
    console.error('API-Error:', error);

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}