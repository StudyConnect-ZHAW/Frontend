'use client';

import React, { useState } from 'react';

type Props = {
  onClose: () => void;
};

export default function NotificationSettings({ onClose }: Props) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [chatNotifications, setChatNotifications] = useState(true);
  const [displayPopups, setDisplayPopups] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  // Save handler with confirmation message
  const handleSave = () => {
    try {
      console.log({ soundEnabled, chatNotifications, displayPopups });
      setStatus('success');
      // Delay close so user can see the success message
      setTimeout(() => {
        setStatus(null);
        onClose();
      }, 800);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus(null), 500);
    }
  };

  return (
    <div className="flex flex-col space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Sound toggle */}
      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={() => setSoundEnabled(!soundEnabled)}
          />
          <span>Sounds aktivieren</span>
        </label>
      </div>

      {/* Chat notifications toggle */}
      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={chatNotifications}
            onChange={() => setChatNotifications(!chatNotifications)}
          />
          <span>Benachrichtigungen für Chats</span>
        </label>
      </div>

      {/* Pop-up toggle */}
      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={displayPopups}
            onChange={() => setDisplayPopups(!displayPopups)}
          />
          <span>Pop-up Hinweise anzeigen</span>
        </label>
      </div>

      {/* Bottom button bar */}
      <div className="border-t pt-4 mt-4 flex justify-between bg-white sticky bottom-0">
        <button
          onClick={onClose}
          className="bg-gray-300 text-foreground px-6 py-2 rounded-xl hover:bg-gray-400 transition"
        >
          Schliessen
        </button>
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition"
        >
          Speichern
        </button>
      </div>

      {/* Status messages */}
      {status === 'success' && (
        <div className="text-green-600 mt-2">Änderungen erfolgreich gespeichert!</div>
      )}
      {status === 'error' && (
        <div className="text-red-600 mt-2">Fehler beim Speichern. Bitte erneut versuchen.</div>
      )}
    </div>
  );
}
