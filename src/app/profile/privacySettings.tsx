'use client';

import React, { useState } from 'react';

type Props = {
  onClose: () => void;
};

export default function PrivacySettings({ onClose }: Props) {
  const [cameraAccess, setCameraAccess] = useState(true);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [privacyPassword, setPrivacyPassword] = useState('');
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  // Handles saving and shows success or error message
  const handleSave = () => {
    try {
      console.log({ cameraAccess, doNotDisturb, privacyPassword });
      setStatus('success');
      // Delay closing to allow message to be visible
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
    <div className="flex flex-col space-y-6 max-h-[70vh] bg-background text-foreground">
      {/* Camera access toggle */}
      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={cameraAccess}
            onChange={() => setCameraAccess(!cameraAccess)}
          />
          <span>Kamerazugriff erlauben</span>
        </label>
      </div>

      {/* Do not disturb toggle */}
      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={doNotDisturb}
            onChange={() => setDoNotDisturb(!doNotDisturb)}
          />
          <span>Bitte nicht stören (Do Not Disturb)</span>
        </label>
      </div>

      {/* Privacy password input */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Privatsphäre-Passwort
        </label>
        <input
          type="password"
          value={privacyPassword}
          onChange={e => setPrivacyPassword(e.target.value)}
          className="w-full border rounded-md px-4 py-2"
        />
      </div>

      {/* Bottom button bar: Schliessen left, Speichern right */}
      <div className="border-t pt-4 mt-4 flex justify-between bg-background sticky bottom-0">
        <button
          onClick={onClose}
          className="button-close"
        >
          Schliessen
        </button>
        <button
          onClick={handleSave}
          className="button-save"
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
