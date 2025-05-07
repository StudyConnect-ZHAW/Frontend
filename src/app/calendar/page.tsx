'use client';

import React from 'react';
import PageHeader from '@/components/PageHeader';

import Calendar from '@/components/Calendar';

export default function CalendarPage() {
  return (
    <>
      <PageHeader title='Calendar' />
      <Calendar/>
    </>
    );
}