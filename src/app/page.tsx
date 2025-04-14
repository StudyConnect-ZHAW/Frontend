'use client';

import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import PageHeader from '@/components/PageHeader';
import WIPSection from "@/components/WIPSection";

import '@/i18n';

const HomePage = () => {
    const {t, i18n} = useTranslation('common');
    const [formattedDate, setFormattedDate] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    const changeLanguage = (lang: 'en-US' | 'de-CH') => {
        i18n.changeLanguage(lang);
        localStorage.setItem('lang', lang);
    };

    useEffect(() => {
        setIsClient(true);

        const date = new Intl.DateTimeFormat(i18n.language, {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(new Date());

        setFormattedDate(date);
    }, [i18n.language]);

    // Avoid hydration mismatch by rendering only on the client
    if (!isClient || !i18n.isInitialized) return null;

    return (
        <>
            <PageHeader title={`${t('welcomeUser', {name: 'Alex'})}`}/>

            <button onClick={() => changeLanguage('en-US')}>🇺🇸 English</button>
            <button onClick={() => changeLanguage('de-CH')}>🇨🇭 Deutsch</button>

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

export default HomePage;