'use client';

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import enLocale from '@fullcalendar/core/locales/en-gb';
import deLocale from '@fullcalendar/core/locales/de';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@fullcalendar/core';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCalendar } from '@/hooks/useCalendar';

interface CalendarProps {
    initialView?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
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
  const shortName = email.includes('@') ? email.split('@')[0] : '';

  const {
    loading: loadingCalendar,
    loadStudents,
    fetchEventsDynamically,
  } = useCalendar(shortName);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  if (loadingUser || loadingCalendar) {
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