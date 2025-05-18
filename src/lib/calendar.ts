import type { ZhawSchedule } from '@/types/calendar';
import type { EventInput } from '@fullcalendar/core';

export function mapZhawDaysToEvents(data: ZhawSchedule): EventInput[] {
  return (data.days ?? []).flatMap((day) => {
    if (!Array.isArray(day.events)) {return [];}
  
    return day.events
      .filter((event) => event.name || event.description)
      .map((event) => {
        const isHoliday = event.type === 'Holiday';
        const isAllDay = event.startTime?.includes('T00:00');
  
        return {
          title: event.name || event.description!,
          start: event.startTime,
          end: event.endTime,
          color: isHoliday ? '#F85A6D' : '#EC3349',
          allDay: isHoliday || isAllDay || false,
        };
      });
  });
}