'use client';

import React, { useState, useEffect } from "react";
import { Dialog } from '@headlessui/react';

import ProfileSettings from './ProfileSettings';
import GeneralSettings from './GeneralSettings';
import AppearanceSettings from './AppearanceSettings';
import AccountSettings from './AccountSettings';
import PrivacySettings from './PrivacySettings';
import NotificationsSettings from './NotificationSettings';
import PageHeader from "@/components/PageHeader";

const settingsBlocks = [
    { title: 'General', description: 'System, Language, Views' },
    { title: 'Appearance', description: 'Theme, Chat Density, Layout' },
    { title: 'Privacy', description: 'DnD, Camera, Privacy Password' },
    { title: 'Notifications / Activity', description: 'Sound, Mute, Chat Notif.' },
    { title: 'Account', description: 'Add/Delete Account' },
    { title: 'Profile', description: 'Profile Picture, Bio, Name' },
];

export default function SettingsPage() {
    /* theme handling */
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const borderAndShadowColor = theme === "dark" ? "#EC3349" : "#FDBA15";

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark") {
            setTheme("dark");
            document.documentElement.classList.add("dark");
        } else {
            // standard = light
            setTheme("light");
            document.documentElement.classList.remove("dark");
        }
    }, []);

    /* modal state */
    const [selectedBlock, setSelectedBlock] = useState<null | string>(null);

    return (
        <main className="min-h-full flex flex-col">
            {/* header: title left, logo + switch right */}
            <PageHeader title="Preferences" />

            {/* setting tiles */}
            <div className="bg-background grid grid-cols-1 md:grid-cols-2 gap-6 border-thick p-6 
      rounded-xl flex-grow border-2" style={{ borderColor: borderAndShadowColor }}>
                {settingsBlocks.map((block) => (
                    <button
                        key={block.title}
                        onClick={() => setSelectedBlock(block.title)}
                        className="
              text-left p-4 rounded-xl border-2 border-color- transition-colors
              bg-card-bg hover:bg-card-hover
              focus:outline-none focus:ring-2 focus:ring-success/50
              active:bg-card-hover
              "
                        style={{ borderColor: borderAndShadowColor }}
                    >
                        <h3 className="text-xl font-semibold">{block.title}</h3>
                        <p className="text-foreground/70 text-sm mt-1">{block.description}</p>
                    </button>
                ))}
            </div>

            {/* modal dialog */}
            <Dialog
                open={!!selectedBlock}
                onClose={() => setSelectedBlock(null)}
                className="relative z-50"
            >
                {/* overlay */}
                <div className="fixed inset-0 bg-black/20 dark:bg-black/40" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4 overflow-hidden">
                    <Dialog.Panel className="bg-background rounded-2xl p-6 w-full max-w-4xl shadow-lg 
          border-thick h-auto">
                        <Dialog.Title className="text-xl font-bold mb-4">{selectedBlock}</Dialog.Title>

                        {selectedBlock === 'Profile' && (
                            <ProfileSettings
                                onClose={() => setSelectedBlock(null)}
                                onSaved={() => setSelectedBlock(null)}
                                shouldSave={false}
                            />
                        )}

                        {selectedBlock === 'General' && (
                            <GeneralSettings
                                onClose={() => setSelectedBlock(null)}
                                onSaved={() => setSelectedBlock(null)}
                                shouldSave={false}
                            />
                        )}

                        {selectedBlock === 'Appearance' && (
                            <AppearanceSettings onClose={() => setSelectedBlock(null)} />
                        )}

                        {selectedBlock === 'Account' && (
                            <AccountSettings onClose={() => setSelectedBlock(null)} />
                        )}

                        {selectedBlock === 'Privacy' && (
                            <PrivacySettings onClose={() => setSelectedBlock(null)} />
                        )}

                        {selectedBlock === 'Notifications / Activity' && (
                            <NotificationsSettings onClose={() => setSelectedBlock(null)} />
                        )}
                    </Dialog.Panel>
                </div>
            </Dialog>
        </main>
    );
}
