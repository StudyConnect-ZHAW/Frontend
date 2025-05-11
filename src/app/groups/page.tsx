'use client';

import PageHeader from '@/components/PageHeader';
import React from 'react';
import { useTranslation } from "react-i18next";
import WIPSection from "@/components/WIPSection";

export default function GroupsPage() {
  const { t } = useTranslation(['groups', 'common']);

  return (
    <>
      <PageHeader title={`${t('groups:title')}`} />

      <WIPSection />
    </>
  );
}