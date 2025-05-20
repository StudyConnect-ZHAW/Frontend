'use client';

import React, { useCallback, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import enLocale from '@fullcalendar/core/locales/en-gb';
import deLocale from '@fullcalendar/core/locales/de';
import { useTranslation } from 'react-i18next';

import { mapZhawDaysToEvents } from '@/lib/calendar';
import { fetchPublicHolidays } from '@/lib/api/openholidays';
import { type EventSourceFuncArg, type EventInput, formatDate } from '@fullcalendar/core';
import type { ZhawSchedule } from '@/types/calendar';

interface CalendarProps {
    initialView?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
    showHeader?: boolean;
  }

export default function Calendar({ initialView = 'dayGridMonth', showHeader = true }: CalendarProps) {
  const { t, i18n } = useTranslation(['calendar']);
  const calendarLocale = i18n.language === 'de-CH' ? deLocale : enLocale;

  const [slotMinTime] = useState('08:00:00');
  const [slotMaxTime] = useState('22:00:00');

  const fetchEventsDynamically = useCallback(
    async (
      fetchInfo: EventSourceFuncArg,
      successCallback: (events: EventInput[]) => void,
      failureCallback: (error: Error) => void
    ) => {
      try {
        const viewStart = fetchInfo.start ? new Date(fetchInfo.start) : new Date();
        const viewEnd = fetchInfo.end ? new Date(fetchInfo.end) : new Date();

        const allEvents: EventInput[] = [];
        const fetchedWeeks = new Set<string>();
        const maxDays = 7;

        // add public holidays
        const publicHolidays = await fetchPublicHolidays(viewStart.getFullYear());
        allEvents.push(...publicHolidays);

        // fetch events per week
        for (let date = new Date(viewStart); date <= viewEnd; date.setDate(date.getDate() + maxDays)) {
          const startingAt = date.toISOString().split('T')[0];
          if (fetchedWeeks.has(startingAt)) {continue;}
          fetchedWeeks.add(startingAt);

          const res = await fetch(`/api/calendar?startingAt=${startingAt}`);
          if (!res.ok) {continue;}

          const data: ZhawSchedule = await res.json();

          const isWeekEmpty =
            !data.days || data.days.length === 0 ||
            data.days.every((day) =>
              !day.events || day.events.every((e) => e.type === 'Holiday')
            );

          if (isWeekEmpty) {
            const end = new Date(date);
            end.setDate(end.getDate() + maxDays);
            allEvents.push({
              title: t('semesterBreak'),
              start: startingAt,
              end: end.toISOString().split('T')[0],
              allDay: true,
              color: '#F85A6D',
            });
          } else {
            const filtered = data.days.map((day) => ({
              ...day,
              events: (day.events ?? []).filter((e) => e.type !== 'Holiday'),
            }));
            allEvents.push(...mapZhawDaysToEvents({ days: filtered }));
          }
        }

        successCallback(allEvents);
      } catch (err) {
        failureCallback(err as Error);
      }
    },
    [t]
  );

  return (
    <div className="flex-grow flex items-center justify-center h-full">
      <div className="w-full max-w-4xl h-full">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
          initialView={initialView}
          headerToolbar={
            showHeader
              ? {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
              }
              : false
          }
          events={fetchEventsDynamically}
          locale={calendarLocale}
          slotMinTime={slotMinTime}
          slotMaxTime={slotMaxTime}
          dayHeaderContent={
            initialView === 'timeGridDay'
              ? (arg) => ({
                html: formatDate(arg.date, {
                  weekday: 'long',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  locale: calendarLocale.code,
                }),
              })
              : undefined
          }
          height="100%"
        />
      </div>
    </div>
  );
}