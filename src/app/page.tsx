'use client';

import { token } from 'morgan';
import { redirect } from 'next/navigation';
import React, {useEffect, useState} from 'react';
import PageHeader from '@/components/PageHeader';
import WIPSection from "@/components/WIPSection";

const HomePage = () => {
    // Store the formatted date to display on the UI
    const [formattedDate, setFormattedDate] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        // TODO: Maybe make the locale selection dynamic depending on the user's navigator.language property
        // Format the current date using a fixed Swiss German locale ('de-CH')
        const userLocale = 'de-CH';
        const date = new Intl.DateTimeFormat(userLocale, {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(new Date());

        setFormattedDate(date);

        // Read user_name from cookie
        const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith('user_name='))
          ?.split('=')[1];
    
        if (cookieValue) {
          setUserName(decodeURIComponent(cookieValue));
        } else {
          redirect('/login'); // Falls kein Benutzername vorhanden ist, zur Sicherheit redirect
        }
    }, []);


  if (!token) {
    redirect('/login');

  } else {
    return (
      <>
                  <PageHeader title={`Welcome ${userName}`}/>
      
                  <div className="flex flex-col flex-1 gap-4">
                      {/* Top row: left empty, right shows date */}
                      <div className="flex flex-row gap-8">
                          <div className="flex-grow basis-0"/>
                          <div className="flex-grow basis-0">
                              <div className="text-2xl font-bold text-black">
                                  {formattedDate}
                              </div>
                          </div>
                      </div>
      
                      <div className="flex flex-row gap-8 h-full">
                          {/* Left column */}
                          <div className="flex flex-col gap-4 flex-grow basis-0">
                              <WIPSection/>
      
                              {/* Shortcuts row */}
                              <div className="flex flex-row gap-4">
                                  <WIPSection/>
                                  <WIPSection/>
                                  <WIPSection/>
                              </div>
                          </div>
      
                          {/* Right column */}
                          <div className="flex flex-col flex-grow basis-0">
                              <WIPSection/>
                          </div>
                      </div>
                  </div>
              </>

    );
  } 
}

export default HomePage;