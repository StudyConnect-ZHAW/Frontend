
// make request to /students to get all students save in list 

// wenn nicht student dann leerer kalendar

// get all students and all lectueres

//getstudentbyshortname und lectuere 
// 
// getweekview/ monthview

import { parseResponse } from '@/lib/api/parseResponse';
import type { ZhawSchedule, ZhawStudents, ZhawLecturers } from '@/types/calendar';

/**
 * Fetch schedule for a given student shortName and date.
 */
export async function fetchZhawSchedule(shortName: string, startingAt: string, viewType: string): Promise<ZhawSchedule> {
  const res = await fetch(`/api/calendar/students/${shortName}?startingAt=${startingAt}&view=${viewType}`);
  
  return parseResponse<ZhawSchedule>(res);
}

/**
 * Fetch the list of all student shortNames.
 */
export async function fetchZhawStudents(): Promise<ZhawStudents> {
  const res = await fetch(`/api/calendar/students`);

  return parseResponse<ZhawStudents>(res);
}

/**
 * Fetch the list of all lecturer shortNames.
 */
export async function fetchZhawLecturers(): Promise<ZhawLecturers> {
  const res = await fetch(`/api/calendar/lecturers`);

  return parseResponse<ZhawLecturers>(res);
}