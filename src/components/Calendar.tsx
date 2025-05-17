'use client';

import React, { useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import enLocale from '@fullcalendar/core/locales/en-gb';

// Typdefinition
interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  color?: string;
  allDay?: boolean;
  extendedProps?: {
    isHoliday?: boolean;
  };
}

function mapZhawDaysToEvents(data: any): CalendarEvent[] {
  return (data.days ?? []).flatMap((day: any) => {
    if (!Array.isArray(day.events)) return [];

    return day.events.map((event: any) => {
      const isHoliday =
        event.startTime?.includes('T00:00') &&
        !event.description &&
        !!event.name;

      return {
        title: isHoliday ? `${event.name}` : (event.name || event.description || 'Event'),
        start: event.startTime,
        end: event.endTime,
        color: isHoliday ? '#F85A6D' : '#EC3349',
        allDay: isHoliday ? true : undefined,
        extendedProps: {
          isHoliday,
        },
      };
    });
  });
}

export default function Calendar() {
  const fetchEventsDynamically = useCallback(
    async (fetchInfo: any, successCallback: any, failureCallback: any) => {
      try {
        const rawStart = new Date(fetchInfo.start);
        rawStart.setDate(rawStart.getDate() + 1);
        const viewStart = rawStart;

        const viewEnd = new Date(fetchInfo.end);
        const maxDays = 7;
        const lastAllowedDate = new Date(viewEnd);
        lastAllowedDate.setDate(lastAllowedDate.getDate() - 1);

        const allEvents: CalendarEvent[] = [];

        const fetchedWeeks = new Set<string>();

        for (
          let date = new Date(viewStart);
          date <= lastAllowedDate;
        ) {
          const startingAt = date.toISOString().split('T')[0];
        
          if (fetchedWeeks.has(startingAt)) {
            date.setDate(date.getDate() + maxDays);
            continue;
          }
          fetchedWeeks.add(startingAt);
        
          const res = await fetch(`/api/calendar?startingAt=${startingAt}`);
          if (!res.ok) {
            date.setDate(date.getDate() + maxDays);
            continue;
          }
        
          const data = await res.json();

          const allDaysEmpty =
            !data.days ||
            data.days.length === 0 ||
            data.days.every((day: any) => !day.events || day.events.length === 0);
          
          if (allDaysEmpty) {
            const start = new Date(date);
            const end = new Date(date);
            end.setDate(end.getDate() + maxDays);
          
            allEvents.push({
              title: 'Semesterunterbruch',
              start: start.toISOString().split('T')[0],
              end: end.toISOString().split('T')[0],
              allDay: true,
              color: '#F85A6D',
              extendedProps: {
                isHoliday: true,
              },
            });
          } else {
            const events = mapZhawDaysToEvents(data);
            allEvents.push(...events);
          }
        
          // immer ans Ende verschieben, damit jede Woche durchlaufen wird
          date.setDate(date.getDate() + maxDays);
        }

        successCallback(allEvents);
      } catch (err) {
        failureCallback(err);
      }
    },
    []
  );

  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={fetchEventsDynamically}
          locale={enLocale}
        />
      </div>
    </div>
  );
}