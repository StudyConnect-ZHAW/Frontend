'use client';

import WIPSection from '@/components/WIPSection';
import React from 'react';

type Props = {
    onClose: () => void;
};

export default function AccountSettings({ onClose }: Props) {
    return (
        <div className="flex flex-col max-h-[70vh] bg-primary-bg text-primary">
            <WIPSection />

            <div className="border-t pt-4 mt-4 flex justify-start bg-primary-bg sticky bottom-0">
                <button onClick={onClose} className="button-close">
                    Schliessen
                </button>
            </div>
        </div>
    );
}
