'use client';
 
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import enLocale from '@fullcalendar/core/locales/en-gb';
 
interface CalendarEvent {
    title: string;
    start: string; // ISO string
    end: string;
  }
 
export default function Calendar() {
 
  const [events, setEvents] = useState<CalendarEvent[]>([]);
 
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/calendar');
        const data = await response.json();
  
        const mapped: CalendarEvent[] = data.days.flatMap((day: any) => {
          if (!day.events) return [];
  
          return day.events.map((event: any) => {
            const title = event.description || event.name || 'Event';
            const start = event.startTime;
            const end = event.endTime;
  
            return {
              title,
              start,
              end,
              color: '#EC3349',
            };
          });
        });
  
        setEvents(mapped);
      } catch (err) {
        console.error('Failed to load schedule:', err);
      }
    };
  
    fetchEvents();
  }, []);
 
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
          events={events}
          locale={enLocale}

        />
      </div>
    </div>
  );
}