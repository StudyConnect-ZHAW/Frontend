'use client';

import React, { useState, useEffect } from 'react';

type Props = {
  onClose: () => void;
  shouldSave: boolean;
  onSaved: () => void;
};

export default function GeneralSettings({ onClose, shouldSave, onSaved }: Props) {
  const [language, setLanguage] = useState('de');
  const [viewStyle, setViewStyle] = useState<'auto' | 'list' | 'grid' | 'compact' | 'detailed'>('auto');
  const [status, setStatus] = useState<'success' | 'error' | null>(null);


  // Trigger external save
  useEffect(() => {
    if (shouldSave) {
      handleSave();
    }
  }, [shouldSave]);

  // Save handler
  const handleSave = () => {
    try {
      console.log({ language, viewStyle });
      setStatus('success');
      setTimeout(() => {
        setStatus(null);
        onSaved(); // notify parent
      }, 800);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus(null), 500);
    }
  };

  return (
    <div className="flex flex-col max-h-[70vh] bg-background text-foreground">
      <div className="overflow-y-auto pr-2 space-y-6 flex-1">
        {/* Language Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sprache</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border rounded-md px-4 py-2 bg-background text-foreground"
          >
            <option value="de">Deutsch</option>
            <option value="en">Englisch</option>
            <option value="fr">Französisch</option>
          </select>
        </div>

        {/* Views (Layout Style) Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Views</label>
          <select
            value={viewStyle}
            onChange={(e) => setViewStyle(e.target.value as 'auto' | 'list' | 'grid' | 'compact' | 'detailed')}
            className="w-full border rounded-md px-4 py-2 bg-background text-foreground"
          >
            <option value="auto">Automatisch</option>
            <option value="list">Liste</option>
            <option value="grid">Grid</option>
            <option value="compact">Kompakt</option>
            <option value="detailed">Detailliert</option>
          </select>
        </div>
      </div>

      {/* Footer Buttons */}
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

      {/* Status Message */}
      {status === 'success' && (
        <div className="text-green-600 mt-2">Änderungen erfolgreich gespeichert!</div>
      )}
      {status === 'error' && (
        <div className="text-red-600 mt-2">Fehler beim Speichern. Bitte erneut versuchen.</div>
      )}
    </div>
  );
}
