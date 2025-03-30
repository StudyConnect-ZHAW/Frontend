'use client';

import React from 'react';
import PageHeader from '@/components/PageHeader';
import WIPSection from "@/components/WIPSection";

const HomePage = () => {
    const formattedDate = new Intl.DateTimeFormat('de-CH', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date());

    return (
        <>
            <PageHeader title='Welcome Alex'/>

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