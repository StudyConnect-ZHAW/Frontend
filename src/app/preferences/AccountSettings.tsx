'use client';

import Button, { ButtonType } from '@/components/Button';
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
                <Button text={"Schliessen"} type={ButtonType.Cancel} onClick={onClose} />
            </div>
        </div>
    );
}
