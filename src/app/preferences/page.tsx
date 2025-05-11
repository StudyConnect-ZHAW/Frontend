'use client';

import React, { useState } from "react";
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
  { title: 'Privacy', description: 'DnD, Camera' },
  { title: 'Notifications / Activity', description: 'Sound, Mute, Chat Notifications' },
  { title: 'Account', description: 'Account Settings' },
  { title: 'Profile', description: 'Profile Picture, Bio, Name' },
];

export default function SettingsPage() {
  const [selectedBlock, setSelectedBlock] = useState<null | string>(null);

  return (
    <main className="min-h-full flex flex-col">
      <PageHeader title="Preferences" />

      {/* Setting tiles */}
      <div className="bg-primary-bg grid grid-cols-2 gap-6 border-main p-6 rounded-xl flex-grow border-2">
        {settingsBlocks.map((block) => (
          <button
            key={block.title}
            onClick={() => setSelectedBlock(block.title)}
            className="text-left p-4 rounded-xl border-2 transition-colors bg-primary-bg border-main cursor-pointer"
          >
            <h3 className="text-xl font-semibold">{block.title}</h3>
            <p className="text-primary mt-1">{block.description}</p>
          </button>
        ))}
      </div>

      {/* Modal for the selected preferences block */}
      <Dialog
        open={!!selectedBlock}
        onClose={() => setSelectedBlock(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-hidden">
          <Dialog.Panel className="bg-primary-bg rounded-2xl p-6 w-full max-w-4xl shadow-lg border-main h-auto">
            <Dialog.Title className="text-xl font-bold mb-4">{selectedBlock}</Dialog.Title>

            {selectedBlock === 'Profile' && (
              <ProfileSettings onClose={() => setSelectedBlock(null)} />
            )}

            {selectedBlock === 'General' && (
              <GeneralSettings onClose={() => setSelectedBlock(null)} />
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