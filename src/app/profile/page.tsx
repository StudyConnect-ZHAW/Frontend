'use client';

import React, { useState } from 'react';
import PageHeader from "@/components/PageHeader";
import WIPSection from "@/components/WIPSection";
import { Dialog } from '@headlessui/react';
import ProfileSettings from './profileSettings';
import GeneralSettings from './generalSettings';
import AppearanceSettings from './appearanceSettings';
import AccountSettings from './accountSettings';
import PrivacySettings from './privacySettings';
import NotificationsSettings from './notificationSettings';


const settingsBlocks = [
  { title: 'General', description: 'System, Language, Views' },
  { title: 'Appearance', description: 'Theme, Chat Density, Layout' },
  { title: 'Privacy', description: 'DnD, Camera, Privacy Password' },
  { title: 'Notifications / Activity', description: 'Sound, Mute, Display Notif., Chat Notif.' },
  { title: 'Account', description: 'Add/Delete Account' },
  { title: 'Profile', description: 'Profile Picture, Bio, Name' },
];

export default function SettingsPage() {
  const [selectedBlock, setSelectedBlock] = useState<null | string>(null);

  return (
    <main className="p-6">
      <PageHeader title="Preferences" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-yellow-300 p-6 rounded-xl shadow mt-6">
        {settingsBlocks.map((block) => (
          <button
            key={block.title}
            onClick={() => setSelectedBlock(block.title)}
            className="text-left border border-yellow-400 rounded-xl p-4 shadow hover:shadow-md transition bg-white"
          >
            <h3 className="text-xl font-semibold">{block.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{block.description}</p>
          </button>
        ))}
      </div>

      <Dialog
        open={!!selectedBlock}
        onClose={() => setSelectedBlock(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <Dialog.Panel className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-lg border border-gray-200">
            <Dialog.Title className="text-xl font-bold mb-4">
              {selectedBlock}
            </Dialog.Title>

            {selectedBlock === 'Profile' && (
              <ProfileSettings
              onClose={() => setSelectedBlock(null)}
              onSaved={() => setSelectedBlock(null)} // ✅ Modal schliessen nach Save
              shouldSave={false}
            />
          )}

            {selectedBlock === 'General' && (
              <GeneralSettings
              onClose={() => setSelectedBlock(null)}
              onSaved={() => setSelectedBlock(null)} // ✅ Modal schliessen nach Save
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

      <WIPSection />
    </main>
  );
}