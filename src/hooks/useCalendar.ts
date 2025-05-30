import { useCallback, useState } from 'react';
import { fetchZhawSchedule, fetchZhawStudents, fetchZhawLecturers } from '@/lib/handlers/calendarHandler';
import { fetchPublicHolidays } from '@/lib/api/openholidays';
import { mapZhawDaysToEvents } from '@/lib/calendar';
import type { EventInput, EventSourceFuncArg } from '@fullcalendar/core';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook to manage loading student/lecturer lists and fetching calendar events.
 *
 * @param shortName The user shortName (e.g., ZHAW login) used to fetch personalized schedules.
 */
export function useCalendar(shortName: string) {
  const [students, setStudents] = useState<string[]>([]);
  const [lecturers, setLecturers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(['calendar']);

  /**
   * Loads the list of students from the backend.
   */
  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const studentList = await fetchZhawStudents();
      setStudents(studentList.students);
      console.log('Loaded students:', studentList.students);
    } catch (err) {
      console.error('Failed to load students', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Loads the list of lecturers from the backend.
   */
  const loadLecturers = useCallback(async () => {
    setLoading(true);
    try {
      const lecturerList = await fetchZhawLecturers();
      setLecturers(lecturerList.lecturers.map((l) => l.shortName));
      console.log('Loaded lecturers:', lecturerList.lecturers.map((l) => l.shortName));
    } catch (err) {
      console.error('Failed to load lecturers', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch dynamic calendar events based on the selected view and date range.
   */
  const fetchEventsDynamically = useCallback(
    async (
      fetchInfo: EventSourceFuncArg,
      successCallback: (events: EventInput[]) => void,
      failureCallback: (error: Error) => void
    ) => {
      try {
        const viewStart = new Date(fetchInfo.start ?? new Date());
        const viewEnd = new Date(fetchInfo.end ?? new Date());
        const viewType = (fetchInfo as { view?: { type?: string } }).view?.type ?? 'timeGridWeek';
        const isDailyView = viewType === 'timeGridDay';

        const allEvents: EventInput[] = [];

        // Always add Swiss public holidays
        const publicHolidays = await fetchPublicHolidays(viewStart.getFullYear());
        allEvents.push(...publicHolidays);

        // If user is not a student → skip ZHAW API calls, only return holidays
        if (!students.includes(shortName) && !lecturers.includes(shortName)) {
          successCallback(allEvents);

          return;
        }

        // Add ZHAW schedule events
        if (isDailyView) {
          const dailyEvents = await fetchDailyView(shortName, viewStart, viewType);
          allEvents.push(...dailyEvents);
        } else {
          const weekEvents = await fetchWeeklyOrMonthlyView(shortName, viewStart, viewEnd, viewType, t);
          allEvents.push(...weekEvents);
        }

        successCallback(allEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        failureCallback(err as Error);
      }
    },
    [shortName, students, lecturers, t]
  );

  return {
    students,
    lecturers,
    loading,
    loadStudents,
    loadLecturers,
    fetchEventsDynamically,
  };
}

/**
 * Fetch events for a daily view.
 */
const fetchDailyView = async (shortName: string, viewStart: Date, viewType: string) => {
  const startingAt = viewStart.toISOString().split('T')[0];
  const data = await fetchZhawSchedule(shortName, startingAt, viewType);
  const filtered = data.days.map((day) => ({
    ...day,
    events: (day.events ?? []).filter((e) => e.type !== 'Holiday'),
  }));

  return mapZhawDaysToEvents({ days: filtered });
};

/**
 * Fetch events for weekly or monthly view.
 */
const fetchWeeklyOrMonthlyView = async (
  shortName: string,
  viewStart: Date,
  viewEnd: Date,
  viewType: string,
  t: (key: string) => string // pass translator function into helper
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

    const data = await fetchZhawSchedule(shortName, startingAt, viewType);
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