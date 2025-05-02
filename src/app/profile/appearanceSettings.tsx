'use client';

import React, { useState } from 'react';

type Props = {
  onClose: () => void;
};

export default function AppearanceSettings({ onClose }: Props) {
  const [theme, setTheme] = useState('light');
  const [density, setDensity] = useState('normal');
  const [layout, setLayout] = useState('grid');
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  // Handles save action and triggers confirmation message
  const handleSave = () => {
    try {
      console.log({ theme, density, layout });
      setStatus('success');
      setTimeout(() => {
        setStatus(null);
        onClose(); // Close dialog after short delay
      }, 800);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus(null), 500);
    }
  };

  return (
    <div className="flex flex-col space-y-6 max-h-[70vh] bg-background text-foreground">
      {/* Theme selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
        <select
          value={theme}
          onChange={e => setTheme(e.target.value)}
          className="w-full border rounded-md px-4 py-2 bg-background text-foreground"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>

        </select>
      </div>

      {/* Chat density setting */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Chat-Dichte</label>
        <select
          value={density}
          onChange={e => setDensity(e.target.value)}
          className="w-full border rounded-md px-4 py-2 bg-background text-foreground"
        >
          <option value="comfortable">Bequem</option>
          <option value="normal">Normal</option>
          <option value="compact">Kompakt</option>
        </select>
      </div>

      {/* Layout selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Layout</label>
        <select
          value={layout}
          onChange={e => setLayout(e.target.value)}
          className="w-full border rounded-md px-4 py-2 bg-background text-foreground"
        >
          <option value="grid">Grid</option>
          <option value="list">List</option>
        </select>
      </div>

      {/* Action buttons */}
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
