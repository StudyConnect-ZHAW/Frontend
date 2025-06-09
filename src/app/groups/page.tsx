'use client';

import React from 'react';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from 'react-i18next';
import Group from '@/components/Group';

export default function GroupsPage() {
  const { t } = useTranslation(['groups', 'common']);
    
  return (
    <>
      {/* Page title */}
      <PageHeader title={t('title')} />
      
      {/* Group component */}
      < Group />
    </>
  );
}