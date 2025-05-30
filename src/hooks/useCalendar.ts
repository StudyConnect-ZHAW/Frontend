import { useCallback, useState } from 'react';
import { fetchZhawSchedule, fetchZhawStudents, fetchZhawLecturers } from '@/lib/handlers/calendarHandler';
import { fetchPublicHolidays } from '@/lib/api/openholidays';
import { mapZhawDaysToEvents } from '@/lib/calendar';
import type { EventInput, EventSourceFuncArg } from '@fullcalendar/core';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook to manage loading user role and fetching calendar events.
 *
 * @param shortName The user shortName (e.g., ZHAW login).
 */
export function useCalendar(shortName: string) {
  const [rolePath, setRolePath] = useState<'students' | 'lecturers' | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(['calendar']);

  const determineUserRole = useCallback(async () => {
    setLoading(true);
    try {
      const [studentList, lecturerList] = await Promise.all([
        fetchZhawStudents(),
        fetchZhawLecturers(),
      ]);

      if (studentList.students.includes(shortName)) {
        setRolePath('students');
      } else if (lecturerList.lecturers.some((l) => l.shortName === shortName)) {
        setRolePath('lecturers');
      } else {
        setRolePath(null);
      }
    } catch (err) {
      console.error('Failed to determine user role', err);
      setRolePath(null); // fallback
    } finally {
      setLoading(false);
    }
  }, [shortName]);

  const fetchEventsDynamically = useCallback(
    async (
      fetchInfo: EventSourceFuncArg,
      successCallback: (events: EventInput[]) => void,
      failureCallback: (error: Error) => void
    ) => {
      try {
        const viewStart = new Date(fetchInfo.start ?? new Date());
        const viewEnd = new Date(fetchInfo.end ?? new Date());

        const [publicHolidays, scheduleEvents] = await Promise.all([
          fetchPublicHolidays(viewStart.getFullYear()),
          rolePath ? fetchScheduleEvents(shortName, viewStart, viewEnd, rolePath, t) : Promise.resolve([]),
        ]);

        successCallback([...publicHolidays, ...scheduleEvents]);
      } catch (err) {
        console.error('Error fetching events:', err);
        failureCallback(err as Error);
      }
    },
    [shortName, rolePath, t]
  );

  return {
    isStudent: rolePath === 'students',
    isLecturer: rolePath === 'lecturers',
    loading,
    determineUserRole,
    fetchEventsDynamically,
  };
}

const fetchScheduleEvents = async (
  shortName: string,
  viewStart: Date,
  viewEnd: Date,
  rolePath: string,
  t: (key: string) => string
) => {
  const allEvents: EventInput[] = [];
  const fetchedWeeks = new Set<string>();
  const maxDays = 7;

  for (let date = new Date(viewStart); date <= viewEnd; date.setDate(date.getDate() + maxDays)) {
    const adjustedDate = new Date(date);
    adjustedDate.setDate(adjustedDate.getDate() + 1);
    const startingAt = adjustedDate.toISOString().split('T')[0];

    if (fetchedWeeks.has(startingAt)) {continue;}
    fetchedWeeks.add(startingAt);

    const data = await fetchZhawSchedule(shortName, startingAt, rolePath);
    const isWeekEmpty =
      !data.days || data.days.length === 0 ||
      data.days.every((day) => !day.events || day.events.every((e) => e.type === 'Holiday'));

    if (isWeekEmpty) {
      const end = new Date(adjustedDate);
      end.setDate(end.getDate() + 7);
      allEvents.push({
        title: t('semesterBreak'),
        start: startingAt,
        end: end.toISOString().split('T')[0],
        allDay: true,
        color: '#F85A6D',
      });
    } else {
      const filtered = data.days.map((day) => ({
        ...day,
        events: (day.events ?? []).filter((e) => e.type !== 'Holiday'),
      }));
      allEvents.push(...mapZhawDaysToEvents({ days: filtered }));
    }
  }

  return allEvents;
};