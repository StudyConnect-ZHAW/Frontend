'use client';

export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import PageHeader from '@/components/PageHeader';
import WIPSection from "@/components/WIPSection";

import '@/i18n';

const HomePage = () => {
  const { t, i18n } = useTranslation('common');
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    const lang = localStorage.getItem('lang') || 'de-CH';

    i18n.changeLanguage(lang).then(() => {
      const date = new Intl.DateTimeFormat(lang, {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date());

      setFormattedDate(date);
      setIsClientReady(true);
    });

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me');
        if (!res.ok) {
          redirect('/login');
        }

        const user = await res.json();
        setUserName(user.firstName + ' ' + user.lastName);
      } catch (err) {
        console.error('Error fetching user:', err);
        redirect('/login');
      }
    };

    fetchUser();
  }, [i18n]);

  if (!userName) {
    return null;
  }

  // Avoid hydration mismatch by rendering only on the client
  if (!isClientReady || !i18n.isInitialized) return null;

  return (
    <>
      <PageHeader title={`${t('welcomeUser', { name: `${userName}` })}`} />

      <div className="flex flex-col flex-1 gap-4">
        {/* Top row: left empty, right shows date */}
        <div className="flex flex-row gap-8">
          <div className="flex-grow basis-0" />
          <div className="flex-grow basis-0">
            <div className="text-2xl font-bold">
              {formattedDate}
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-8 h-full">
          {/* Left column */}
          <div className="flex flex-col gap-4 flex-grow basis-0">
            <WIPSection />

            {/* Shortcuts row */}
            <div className="flex flex-row gap-4">
              <WIPSection />
              <WIPSection />
              <WIPSection />
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col flex-grow basis-0">
            <WIPSection />
          </div>
        </div>
      </div>
    </>

  );
};

export default HomePage;