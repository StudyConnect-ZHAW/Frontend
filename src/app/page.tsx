'use client';

import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import PageHeader from '@/components/PageHeader';
import WIPSection from "@/components/WIPSection";
import Calendar from '@/components/Calendar';

const HomePage = () => {
  const [userName, setUserName] = useState<string | null>(null);

  const { t, i18n } = useTranslation('common');

  useEffect(() => {
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
  }, [i18n.language]);

  if (!userName) {
    return null;
  }

  return (
    <>
      <PageHeader title={t('welcomeUser', { name: `${userName}` })} />

      <div className="flex flex-col flex-1 gap-4">
        {/* Top row: left empty, right shows date */}
        <div className="flex flex-row gap-8">
          <div className="flex-grow basis-0" />
          <div className="flex-grow basis-0">
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
          <div className="flex flex-col gap-4 flex-grow basis-0">
            <Calendar initialView="timeGridDay" showHeader={false} />
          </div>
        </div>
      </div>
    </>

  );
};

export default HomePage;