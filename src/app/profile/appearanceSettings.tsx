'use client';

import React, { useState } from 'react';

type Props = {
  onClose: () => void;
};

export default function AppearanceSettings({ onClose }: Props) {
  // read initial theme from <html> to keep current mode if dialog is closed without saving
  const initialTheme =
    document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);
  const [density, setDensity] = useState('normal');
  const [layout, setLayout] = useState('grid');
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  // apply theme and store it in localStorage
  const applyTheme = (mode: 'light' | 'dark') => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('theme', mode);
  };

  // handle save action, apply changes, show status, close dialog
  const handleSave = () => {
    try {
        console.log({ theme, density, layout });

        // Save theme to localStorage
        localStorage.setItem('theme', theme);
    
        // Apply the theme class to <html>
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        setStatus('success');
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
      {/* scrollable content */}
      <div className="overflow-y-auto pr-2 space-y-6 flex-1">

        {/* Theme selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Theme</label>
          <select
            value={theme}
            onChange={e => setTheme(e.target.value as 'light' | 'dark')}
            className="w-full border rounded-md px-4 py-2 bg-background text-foreground"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* Chat density selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Chat-Dichte</label>
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
          <label className="block text-sm font-medium text-foreground mb-1">Layout</label>
          <select
            value={layout}
            onChange={e => setLayout(e.target.value)}
            className="w-full border rounded-md px-4 py-2 bg-background text-foreground"
          >
            <option value="grid">Grid</option>
            <option value="list">List</option>
          </select>
        </div>
      </div>

      {/* footer buttons */}
      <div className="border-t pt-4 mt-4 flex justify-between bg-background sticky bottom-0">
        <button onClick={onClose} className="button-close">Schliessen</button>
        <button onClick={handleSave} className="button-save">Speichern</button>
      </div>

      {/* status messages */}
      {status === 'success' && (
        <div className="text-green-600 mt-2">Änderungen erfolgreich gespeichert!</div>
      )}
      {status === 'error' && (
        <div className="text-red-600 mt-2">Fehler beim Speichern. Bitte erneut versuchen.</div>
      )}
    </div>
  );
}
