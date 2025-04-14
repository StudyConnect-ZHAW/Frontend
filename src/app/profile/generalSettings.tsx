'use client';

import React, { useState, useEffect } from 'react';

type Props = {
  onClose: () => void;
  shouldSave: boolean;
  onSaved: () => void;
};

export default function GeneralSettings({ onClose, shouldSave, onSaved }: Props) {
  const [language, setLanguage] = useState('de');
  const [systemMode, setSystemMode] = useState<'light' | 'dark'>('light');
  const [viewStyle, setViewStyle] = useState<'list' | 'grid'>('list');
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    if (shouldSave) {
      handleSave();
    }
  }, [shouldSave]);

  const handleSave = () => {
    try {
      console.log({ language, systemMode, viewStyle });
      setStatus('success');
      setTimeout(() => {
        setStatus(null);
        onSaved(); // close dialog
      }, 1000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <div className="flex flex-col max-h-[70vh]">
      <div className="overflow-y-auto pr-2 space-y-6 flex-1">
        {/* Language selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sprache</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border rounded-md px-4 py-2"
          >
            <option value="de">Deutsch</option>
            <option value="en">Englisch</option>
            <option value="fr">Französisch</option>
          </select>
        </div>

        {/* System mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Systemmodus</label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name="systemMode"
                value="light"
                checked={systemMode === 'light'}
                onChange={() => setSystemMode('light')}
              />{' '}
              Hell
            </label>
            <label>
              <input
                type="radio"
                name="systemMode"
                value="dark"
                checked={systemMode === 'dark'}
                onChange={() => setSystemMode('dark')}
              />{' '}
              Dunkel
            </label>
          </div>
        </div>

        {/* View style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Darstellungsstil</label>
          <select
            value={viewStyle}
            onChange={(e) => setViewStyle(e.target.value as 'list' | 'grid')}
            className="w-full border rounded-md px-4 py-2"
          >
            <option value="list">Liste</option>
            <option value="grid">Grid</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="border-t pt-4 mt-4 flex justify-between bg-white sticky bottom-0">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Schließen
        </button>
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition"
        >
          Speichern
        </button>
      </div>

      {/* Status message */}
      {status === 'success' && (
        <div className="text-green-600 mt-2">Einstellungen gespeichert!</div>
      )}
      {status === 'error' && (
        <div className="text-red-600 mt-2">Fehler beim Speichern. Bitte erneut versuchen.</div>
      )}
    </div>
  );
}
