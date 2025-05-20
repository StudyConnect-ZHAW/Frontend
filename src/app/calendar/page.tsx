'use client';

import React from 'react';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from 'react-i18next';
import Calendar from '@/components/Calendar';

// * CalendarPage: Standalone page that displays the ZHAW calendar with public holidays
export default function CalendarPage() {
  const { t } = useTranslation(['calendar', 'common']);
    
  return (
    <>
      {/* Page title */}
      <PageHeader title={t('title')} />
      
      {/* Full calendar component */}
      <Calendar />
    </>
  );
}