'use client';

import React from 'react';
import Button, { ButtonType } from '@/components/Button';
import { redirect } from 'next/navigation';

type Props = {
    onClose: () => void;
};

export default function AccountSettings({ onClose }: Props) {
    const handleLogout = () => {
        redirect('/auth/logout');
    }

    return (
        <div className="flex flex-col max-h-[70vh] bg-primary-bg text-primary">
            <div className="flex justify-start bg-primary-bg sticky bottom-0">
                <Button text={"Abmelden"} type={ButtonType.Destructive} onClick={handleLogout} />
            </div>

            <div className="border-t pt-4 mt-4 flex justify-start bg-primary-bg sticky bottom-0">
                <Button text={"Schliessen"} type={ButtonType.Cancel} onClick={onClose} />
            </div>
        </div>
    );
}
