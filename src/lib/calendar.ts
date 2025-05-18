import { TFunction } from 'i18next';
import type { ZhawSchedule } from '@/types/calendar';
import type { EventInput } from '@fullcalendar/core';

export function mapZhawDaysToEvents(data: ZhawSchedule, t: TFunction): EventInput[] {
  return (data.days ?? []).flatMap((day) => {
    if (!Array.isArray(day.events)) {return [];}

    return day.events.map((event) => {
      const isHoliday = event.type === 'Holiday';
      const isAllDay = event.startTime?.includes('T00:00');

      const title = isHoliday
        ? t(event.name || 'Unbekannter Feiertag')
        : event.name || event.description || 'Event';

      return {
        title,
        start: event.startTime,
        end: event.endTime,
        color: isHoliday ? '#F85A6D' : '#EC3349',
        allDay: isHoliday || isAllDay || false,
      };
    });
  });
}