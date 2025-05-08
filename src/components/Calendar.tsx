'use client';

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

export default function Calendar() {
    return (
        <div className="flex-grow flex items-center justify-center">
            <div className="w-full max-w-3xl">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={[
            { title: 'Test Event', date: '2025-05-07' },
            { title: 'Meeting', date: '2025-05-09' },
          ]}
        />
      </div>
    </div>
  );
}