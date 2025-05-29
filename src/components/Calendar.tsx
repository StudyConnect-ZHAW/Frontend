'use client';

import React, { useCallback, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import enLocale from '@fullcalendar/core/locales/en-gb';
import deLocale from '@fullcalendar/core/locales/de';
import { useTranslation } from 'react-i18next';
import { type EventInput, type EventSourceFuncArg, formatDate } from '@fullcalendar/core';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import { mapZhawDaysToEvents } from '@/lib/calendar';
import { fetchPublicHolidays } from '@/lib/api/openholidays';
import type { ZhawSchedule } from '@/types/calendar';

interface CalendarProps {
    initialView?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
    showHeader?: boolean;
  }

/*
* Calendar component for displaying ZHAW schedule and Swiss public holidays
* Integrates FullCalendar and fetches weekly schedule + holidays dynamically
*/
export default function Calendar({ initialView = 'dayGridMonth', showHeader = true }: CalendarProps) {
  const { t, i18n } = useTranslation(['calendar']);
  const calendarLocale = i18n.language === 'de-CH' ? deLocale : enLocale;

  const [slotMinTime] = useState('08:00:00');
  const [slotMaxTime] = useState('22:00:00');

  const { user, loading: loadingUser } = useCurrentUser();

  const email = user?.email?.toLowerCase() ?? '';
  const shortName = email.includes('@') ? email.split('@')[0] : null;

  //   const [events, setEvents] ≠ useState([]);

  const fetchEventsDynamically = useCallback(
    async (
      fetchInfo: EventSourceFuncArg,
      successCallback: (events: EventInput[]) => void,
      failureCallback: (error: Error) => void
    ) => {
      try {
        const viewStart = new Date(fetchInfo.start ?? new Date());
        const viewEnd = new Date(fetchInfo.end ?? new Date());

        const viewType = (fetchInfo as { view?: { type?: string } }).view?.type ?? initialView;
        const isDailyView = viewType === 'timeGridDay';

        const allEvents: EventInput[] = [];
        const fetchedWeeks = new Set<string>();
        const maxDays = 7;

        // Add Swiss public holidays for the current year
        const publicHolidays = await fetchPublicHolidays(viewStart.getFullYear());
        allEvents.push(...publicHolidays);

        if (isDailyView) {
          const adjustedDate = new Date(viewStart);
          const startingAt = adjustedDate.toISOString().split('T')[0];

          // Fetch calendar for a single day
          const res = await fetch(`/api/calendar/students/${shortName}?startingAt=${startingAt}&view=${viewType}`);

          if (!res.ok) {return;}

          const data: ZhawSchedule = await res.json();

          const filtered = data.days.map((day) => ({
            ...day,
            events: (day.events ?? []).filter((e) => e.type !== 'Holiday'),
          }));

          // Convert to FullCalendar format and add to event list
          allEvents.push(...mapZhawDaysToEvents({ days: filtered }));
        } else {
          // Weekly/monthly view – loop through each week
          for (let date = new Date(viewStart); date <= viewEnd; date.setDate(date.getDate() + maxDays)) {
            const adjustedDate = new Date(date);

            // Shift by +1 day because ZHAW calendar weeks start on Monday (API returns Sunday)
            adjustedDate.setDate(adjustedDate.getDate() + 1);

            const startingAt = adjustedDate.toISOString().split('T')[0];

            // Avoid duplicate API requests for the same week
            if (fetchedWeeks.has(startingAt)) {
              continue;
            }
            fetchedWeeks.add(startingAt);

            // Fetch calendar for the current week
            const res = await fetch(`/api/calendar/students/${shortName}?startingAt=${startingAt}&view=${viewType}`);
            if (!res.ok) {continue;}

            const data: ZhawSchedule = await res.json();

            // Check if the week is empty (no regular events, only holidays or none)
            const isWeekEmpty =
              !data.days || data.days.length === 0 ||
              data.days.every((day) => !day.events || day.events.every((e) => e.type === 'Holiday'));

            if (isWeekEmpty) {
              // Add placeholder event to indicate semester break
              const end = new Date(adjustedDate);
              end.setDate(end.getDate() + 7);
              allEvents.push({
                title: t('semesterBreak'),
                start: startingAt,
                end: end.toISOString().split('T')[0],
                allDay: true,
                color: '#F85A6D',
              });
            } else {
              // Filter out holidays and map events to calendar format
              const filtered = data.days.map((day) => ({
                ...day,
                events: (day.events ?? []).filter((e) => e.type !== 'Holiday'),
              }));
              allEvents.push(...mapZhawDaysToEvents({ days: filtered }));
            }
          }
        }
        console.log(allEvents);

        successCallback(allEvents);
      } catch (err) {
        failureCallback(err as Error);
      }
    },
    [initialView, shortName, t]
  );

  if (!user || !user.email || loadingUser) {
    return (
      <div className="flex items-center justify-center h-full text-primary text-xl">
        {t('common:loading')}
      </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center h-full">
      <div className="w-full max-w-4xl h-full">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView={initialView}
          headerToolbar={
            showHeader
              ? {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }
              : false
          }
          events={fetchEventsDynamically}
          locale={calendarLocale}
          slotMinTime={slotMinTime}
          slotMaxTime={slotMaxTime}
          height="100%"
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
          
          /**
           * Only override rendering if in timeGrid views.
           * Otherwise let FullCalendar render its default styled event.
           **/
          eventContent={
            initialView === 'timeGridDay' || initialView === 'timeGridWeek'
              ? (arg) => {
                const room = arg.event.extendedProps.room;

                return (
                  <>
                    <div>{arg.event.title}</div>
                    {room && (
                      <div className="text-xs text-white-400">{room}</div>
                    )}
                  </>
                );
              }
              : undefined
          }
        />
      </div>
    </div>
  );
}