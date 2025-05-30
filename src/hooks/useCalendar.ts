import { useCallback, useState } from 'react';
import { fetchZhawStudents, fetchZhawLecturers } from '@/lib/handlers/calendarHandler';
import { fetchPublicHolidays } from '@/lib/api/openholidays';
import { generateCalendarEvents } from '@/lib/calendar';
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

    setLoading(false);
  }, [shortName]);

  const fetchEventsDynamically = useCallback(
    async (
      fetchInfo: EventSourceFuncArg,
      successCallback: (events: EventInput[]) => void    ) => {
      const viewStart = new Date(fetchInfo.start ?? new Date());
      const viewEnd = new Date(fetchInfo.end ?? new Date());

      const [publicHolidays, scheduleEvents] = await Promise.all([
        fetchPublicHolidays(viewStart.getFullYear()),
        rolePath ? generateCalendarEvents(shortName, viewStart, viewEnd, rolePath, t) : Promise.resolve([]),
      ]);

      successCallback([...publicHolidays, ...scheduleEvents]);
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