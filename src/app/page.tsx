'use client';

import { useTranslation } from "react-i18next";
import PageHeader from '@/components/PageHeader';
import WIPSection from "@/components/WIPSection";
import Calendar from '@/components/Calendar';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import GroupsPage from "./groups/page";

// * HomePage component: displays welcome header, sections, and calendar for the current ZHAW user
const HomePage = () => {
  const { user, loading } = useCurrentUser();
  const { t } = useTranslation('common');

  // Don't render the page until the user is loaded
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-full text-primary text-xl">
        {t('common:loading')}
      </div>
    );
  }

  return (
    <>
      <PageHeader title={t('welcomeUser', { name: `${user.firstName} ${user.lastName}` })} />

      <div className="flex flex-col flex-1 gap-4">
        {/* Top row: left empty, right shows date */}
        <div className="flex flex-row gap-8">
          <div className="flex-grow basis-0" />
          <div className="flex-grow basis-0" />
        </div>

        <div className="flex flex-row gap-8 h-full">
          {/* Left column */}
          <div className="flex flex-col gap-4 flex-grow basis-0">
            <div className="w-full max-w-4xl h-full border-main rounded-lg p-2">
              <GroupsPage />
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