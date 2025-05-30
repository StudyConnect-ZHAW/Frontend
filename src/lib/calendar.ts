import type { ZhawSchedule } from '@/types/calendar';
import type { EventInput } from '@fullcalendar/core';
import { fetchZhawSchedule} from '@/lib/handlers/calendarHandler';

/**
 * Fetches ZHAW schedule data for a given shortName and date range,
 * processes each week, detects empty (holiday) weeks, and maps the results
 * into FullCalendar-compatible events.
 *
 * - Splits the date range into 7-day chunks.
 * - Marks full weeks as semester breaks if no non-holiday events exist.
 * - Filters out holidays from normal event weeks.
 *
 * @param shortName The user's ZHAW shortName (username).
 * @param viewStart Start date of the calendar view.
 * @param viewEnd End date of the calendar view.
 * @param rolePath Either 'students' or 'lecturers' to determine API route.
 * @param t Translation function for i18n (used for labels like 'semesterBreak').
 * @returns An array of FullCalendar EventInput objects.
 */
export const generateCalendarEvents = async (
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

/**
 * Converts a ZHAW schedule object into an array of FullCalendar-compatible events.
 * Filters out invalid entries and handles holiday & all-day classification.
 */
function mapZhawDaysToEvents(data: ZhawSchedule): EventInput[] {
  return (data.days ?? []).flatMap((day) => {
    if (!Array.isArray(day.events)) {return [];}

    return day.events
      // Only include events with a name or description
      .filter((event) => event.name || event.description)
      .map((event) => {
        const isHoliday = event.type === 'Holiday';
        const isAllDay = event.startTime?.includes('T00:00');

        return {
          title: event.name || event.description!, // fallback to description if name is missing
          extendedProps: {
            room: event.eventRealizations?.[0]?.room?.name ?? '',
          },
          start: event.startTime,
          end: event.endTime,
          color: isHoliday ? '#F85A6D' : '#EC3349',
          allDay: isHoliday || isAllDay || false,
        };
      });
  });
}