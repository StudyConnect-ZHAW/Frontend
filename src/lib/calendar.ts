import type { ZhawSchedule } from '@/types/calendar';
import type { EventInput } from '@fullcalendar/core';

/**
 * Converts a ZHAW schedule object into an array of FullCalendar-compatible events.
 * Filters out invalid entries and handles holiday & all-day classification.
 */
export function mapZhawDaysToEvents(data: ZhawSchedule): EventInput[] {
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