'use client';
 
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import enLocale from '@fullcalendar/core/locales/en-gb';
 
interface CalendarEvent {
  title: string;
  date: string;
}
 
export default function Calendar() {
 
  const [events, setEvents] = useState<CalendarEvent[]>([]);
 
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/calendar'); 
        const data = await response.json();
  
        // todo: fix data 
        const mapped = data.map((entry: any) => ({
          title: `${entry.courseTitle ?? 'Vorlesung'}`,
          date: entry.startTime.split('T')[0],
        }));

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