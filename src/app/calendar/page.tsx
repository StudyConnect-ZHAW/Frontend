'use client';

import React from 'react';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from 'react-i18next';
import Calendar from '@/components/Calendar';

export default function CalendarPage() {
  const { t } = useTranslation(['calendar', 'common']);
    
  return (
    <>
      <PageHeader title={t('title')} />
      <Calendar/>
    </>
  );
}