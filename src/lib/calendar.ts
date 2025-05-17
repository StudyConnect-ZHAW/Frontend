import type { CalendarEvent, ZhawSchedule } from '@/types/calendar';

export function mapZhawDaysToEvents(data: ZhawSchedule): CalendarEvent[] {
  return (data.days ?? []).flatMap((day) =>
    day.events?.map((event) => {
      const isHoliday =
        event.startTime?.includes('T00:00') &&
        !event.description &&
        !!event.name;

      return {
        title: isHoliday ? `${event.name}` : event.name || event.description || 'Event',
        start: event.startTime,
        end: event.endTime,
        color: isHoliday ? '#F85A6D' : '#EC3349',
        allDay: isHoliday || false,
        extendedProps: { isHoliday },
      };
    }) ?? []
  );
}