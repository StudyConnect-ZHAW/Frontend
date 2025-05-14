'use client';

import PageHeader from '@/components/PageHeader';
import React from 'react';
import { useTranslation } from "react-i18next";
import WIPSection from "@/components/WIPSection";

export default function ChatPage() {
  const { t } = useTranslation(['chat', 'common']);

  return (
    <>
      <PageHeader title={t('title')} />

      <WIPSection />
    </>
  );
}
