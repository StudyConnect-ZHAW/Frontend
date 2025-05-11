'use client';

import PageHeader from '@/components/PageHeader';
import React from 'react';
import { useTranslation } from "react-i18next";
import WIPSection from "@/components/WIPSection";

const ForumPage = () => {
  const { t } = useTranslation(['forum', 'common']);

  return (
    <>
      <PageHeader title={`${t('title')}`} />

      <WIPSection />
    </>
  );
}

export default ForumPage;