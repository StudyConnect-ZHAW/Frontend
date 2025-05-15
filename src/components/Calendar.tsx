'use client';

import React, { useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import enLocale from '@fullcalendar/core/locales/en-gb';

interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  color?: string;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  
  return result;
}
  

export default function Calendar() {
  const fetchEventsDynamically = useCallback(
    async (fetchInfo: any, successCallback: any, failureCallback: any) => {
      try {
        const viewStart = new Date(fetchInfo.start);
        const viewEnd = new Date(fetchInfo.end);
        const maxDays = 7;

        const allEvents: CalendarEvent[] = [];

        const lastAllowedDate = new Date(viewEnd);
        lastAllowedDate.setDate(lastAllowedDate.getDate() - 1);

        for (
          let date = new Date(viewStart);
          date <= lastAllowedDate;
          date.setDate(date.getDate() + maxDays)
        ) {
          const startingAt = date.toISOString().split('T')[0];

          const res = await fetch(`/api/calendar?startingAt=${startingAt}`);
          if (!res.ok) {continue;}

          const data = await res.json();
          
          const events = data.days.flatMap((day: any) => {
            if (!day.events) {return [];}
            
            return day.events.map((event: any) => ({
              title: event.description || event.name || 'Event',
              start: event.startTime,
              end: event.endTime,
              color: '#EC3349',
            }));
          });

          allEvents.push(...events);
        }

        successCallback(allEvents);
      } catch (err) {
        console.error(err);
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
          eventSources={[fetchEventsDynamically]}
          locale={enLocale}
        />
      </div>
    </div>
  );
}