'use client';

import React, { useState } from 'react';
import PageHeader from "@/components/PageHeader";
import WIPSection from "@/components/WIPSection";
import { Dialog } from '@headlessui/react';
import ProfileSettings from './ProfileSettings';

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
          {selectedBlock === 'Profile' ? 'Profile' : selectedBlock}
          </Dialog.Title>


            {selectedBlock === 'Profile' ? (
              <ProfileSettings onClose={() => setSelectedBlock(null)} />
            ) : (
              <>
                <p className="text-gray-700 mb-4">
                  Hier kannst du die Einstellungen für <strong>{selectedBlock}</strong> bearbeiten.
                </p>
                <div className="flex justify-end mt-6">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => setSelectedBlock(null)}
                  >
                    Schließen
                  </button>
                </div>
              </>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>

      <WIPSection />
    </main>
  );
}