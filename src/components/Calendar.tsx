'use client';

import React, { useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { mapZhawDaysToEvents } from '@/lib/calendar';
import type { EventSourceFuncArg, EventInput } from '@fullcalendar/core';
import type { ZhawSchedule } from '@/types/calendar';
import enLocale from '@fullcalendar/core/locales/en-gb';
import deLocale from '@fullcalendar/core/locales/de';
import { useTranslation } from "react-i18next";

export default function Calendar() {

  const { t, i18n } = useTranslation(['calendar']);
  const calendarLocale = i18n.language === 'de-CH' ? deLocale : enLocale;

  const fetchEventsDynamically = useCallback(
    async (
      fetchInfo: EventSourceFuncArg,
      successCallback: (events: EventInput[]) => void,
      failureCallback: (error: Error) => void
    ) => {
      try {
        const viewStart = new Date(fetchInfo.start);
        viewStart.setDate(viewStart.getDate() + 1);
        const viewEnd = new Date(fetchInfo.end);
        viewEnd.setDate(viewEnd.getDate() - 1);
      
        const allEvents: EventInput[] = [];
        const fetchedWeeks = new Set<string>();
        const maxDays = 7;
      
        for (let date = new Date(viewStart); date <= viewEnd; date.setDate(date.getDate() + maxDays)) {
          const startingAt = date.toISOString().split('T')[0];
          if (fetchedWeeks.has(startingAt)) {continue;}
          fetchedWeeks.add(startingAt);
      
          const res = await fetch(`/api/calendar?startingAt=${startingAt}`);
          if (!res.ok) {continue;}
      
          const data: ZhawSchedule = await res.json();
      
          const isWeekEmpty =
                !data.days || data.days.length === 0 ||
                data.days.every((day) => !day.events || day.events.length === 0);
      
          if (isWeekEmpty) {
            const end = new Date(date);
            end.setDate(end.getDate() + maxDays);
            allEvents.push({
              title: t('semester_break'),
              start: startingAt,
              end: end.toISOString().split('T')[0],
              allDay: true,
              color: '#F85A6D',
            });
          } else {
            allEvents.push(...mapZhawDaysToEvents(data, t));
          }
        }
      
        successCallback(allEvents as EventInput[]);
      } catch (err) {
        failureCallback(err as Error);
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
          locale={calendarLocale}
        />
      </div>
    </div>
  );
}