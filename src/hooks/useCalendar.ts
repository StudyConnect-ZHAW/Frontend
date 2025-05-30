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
    if (rolePath !== null) {return;} // already determined

    setLoading(true);
    try {
      const studentList = await fetchZhawStudents();
      if (studentList.students.includes(shortName)) {
        setRolePath('students');

        return;
      }

      const lecturerList = await fetchZhawLecturers();
      const lecturerShortNames = (lecturerList?.lecturers ?? []).map((l) => l.shortName);

      if (lecturerShortNames.includes(shortName)) {
        setRolePath('lecturers');
        
        return;
      }

      setRolePath(null); // neither student nor lecturer
    } catch (err) {
      console.error('Failed to determine user role', err);
    } finally {
      setLoading(false);
    }
  }, [shortName, rolePath]);

  const fetchEventsDynamically = useCallback(
    async (
      fetchInfo: EventSourceFuncArg,
      successCallback: (events: EventInput[]) => void,
      failureCallback: (error: Error) => void
    ) => {
      try {
        const viewStart = new Date(fetchInfo.start ?? new Date());
        const viewEnd = new Date(fetchInfo.end ?? new Date());
        const viewType = fetchInfo.view?.type ?? 'timeGridWeek';
        const isDailyView = viewType === 'timeGridDay';

        const allEvents: EventInput[] = [];

        const publicHolidays = await fetchPublicHolidays(viewStart.getFullYear());
        allEvents.push(...publicHolidays);

        if (rolePath === null) {
          successCallback(allEvents);

          return;
        }

        if (isDailyView) {
          const dailyEvents = await fetchDailyView(shortName, viewStart, viewType, rolePath);
          allEvents.push(...dailyEvents);
        } else {
          const weekEvents = await fetchWeeklyOrMonthlyView(shortName, viewStart, viewEnd, viewType, rolePath, t);
          allEvents.push(...weekEvents);
        }

        successCallback(allEvents);
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

const fetchDailyView = async (shortName: string, viewStart: Date, viewType: string, rolePath: string) => {
  const startingAt = viewStart.toISOString().split('T')[0];
  const data = await fetchZhawSchedule(shortName, startingAt, rolePath);
  const filtered = data.days.map((day) => ({
    ...day,
    events: (day.events ?? []).filter((e) => e.type !== 'Holiday'),
  }));

  return mapZhawDaysToEvents({ days: filtered });
};

const fetchWeeklyOrMonthlyView = async (
  shortName: string,
  viewStart: Date,
  viewEnd: Date,
  viewType: string,
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