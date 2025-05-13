import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // change user
    const res = await fetch('https://api.apps.engineering.zhaw.ch/v1/schedules/students/mohatsum', {
      headers: {
        'User-Agent': 'StudyConnect (https://github.com/StudyConnect-ZHAW)',
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch ZHAW calendar' }, { status: res.status });
    }

    const data = await res.json();
    
    return NextResponse.json(data);
  } catch (err) {
    console.error('Failed to fetch calendar:', err);

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}