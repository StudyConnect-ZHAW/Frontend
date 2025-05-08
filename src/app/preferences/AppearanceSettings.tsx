'use client';

import React, { useEffect, useState } from 'react';
import Button, { ButtonVariant } from '@/components/Button';
import { showToast, ToastType } from '@/components/Toast';

type Props = {
  onClose: () => void;
};

export default function AppearanceSettings({ onClose }: Props) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Placeholder settings
  const [density, setDensity] = useState('normal');
  const [layout, setLayout] = useState('grid');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = storedTheme ?? (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  const applyTheme = (mode: 'light' | 'dark') => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('theme', mode);
  };

  const handleSave = () => {
    applyTheme(theme);
    showToast(ToastType.Success, "Success", "Successfully saved the changes.");
  };

  return (
    <div className="flex flex-col space-y-6 max-h-[70vh] bg-primary-bg text-primary">
      {/* scrollable content */}
      <div className="overflow-y-auto pr-2 space-y-6 flex-1">

        {/* Theme selection */}
        <div>
          <label className="block text-primary mb-1">Theme</label>
          <select
            value={theme}
            onChange={e => setTheme(e.target.value as 'light' | 'dark')}
            className="w-full border rounded-md px-4 py-2 bg-primary-bg text-primary"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* Chat density selection */}
        <div>
          <label className="block text-primary mb-1">Chat-Dichte</label>
          <select
            value={density}
            onChange={e => setDensity(e.target.value)}
            className="w-full border rounded-md px-4 py-2 bg-primary-bg text-primary"
          >
            <option value="comfortable">Bequem</option>
            <option value="normal">Normal</option>
            <option value="compact">Kompakt</option>
          </select>
        </div>

        {/* Layout selection */}
        <div>
          <label className="block text-primary mb-1">Layout</label>
          <select
            value={layout}
            onChange={e => setLayout(e.target.value)}
            className="w-full border rounded-md px-4 py-2 bg-primary-bg text-primary"
          >
            <option value="grid">Grid</option>
            <option value="list">List</option>
          </select>
        </div>
      </div>

      <div className="border-t pt-4 mt-4 flex justify-between bg-primary-bg sticky bottom-0">
        <Button text={"Schliessen"} type={ButtonVariant.Ghost} onClick={onClose} />
        <Button text={"Speichern"} type={ButtonVariant.Primary} onClick={handleSave} />
      </div>
    </div>
  );
}
